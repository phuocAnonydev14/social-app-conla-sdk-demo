"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const chai_1 = require("chai");
const withArgs_1 = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const hardhat_1 = require("hardhat");
const src_1 = require("../src");
const aa_conla_utils_1 = require("aa-conla-utils");
const provider = hardhat_1.ethers.provider;
const signer = provider.getSigner();
describe('SimpleAccountAPI', () => {
    let owner;
    let api;
    let entryPoint;
    let beneficiary;
    let recipient;
    let accountAddress;
    let accountDeployed = false;
    before('init', async () => {
        entryPoint = await (0, aa_conla_utils_1.deployEntryPoint)(provider);
        beneficiary = await signer.getAddress();
        recipient = await new aa_conla_utils_1.SampleRecipient__factory(signer).deploy();
        owner = ethers_1.Wallet.createRandom();
        aa_conla_utils_1.DeterministicDeployer.init(hardhat_1.ethers.provider);
        const factoryAddress = await aa_conla_utils_1.DeterministicDeployer.deploy(new aa_conla_utils_1.SimpleAccountFactory__factory(), 0, [entryPoint.address]);
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner,
            factoryAddress
        });
    });
    it('#getUserOpHash should match entryPoint.getUserOpHash', async function () {
        const userOp = {
            sender: '0x'.padEnd(42, '1'),
            nonce: 2,
            callData: '0x4444',
            callGasLimit: 5,
            verificationGasLimit: 6,
            preVerificationGas: 7,
            maxFeePerGas: 8,
            maxPriorityFeePerGas: 9,
            signature: '0xbbbb'
        };
        const hash = await api.getUserOpHash(userOp);
        const epHash = await entryPoint.getUserOpHash((0, aa_conla_utils_1.packUserOp)(userOp));
        (0, chai_1.expect)(hash).to.equal(epHash);
    });
    it('should deploy to counterfactual address', async () => {
        accountAddress = await api.getAccountAddress();
        (0, chai_1.expect)(await provider.getCode(accountAddress).then(code => code.length)).to.equal(2);
        await signer.sendTransaction({
            to: accountAddress,
            value: (0, utils_1.parseEther)('0.1')
        });
        const op = await api.createSignedUserOp({
            target: recipient.address,
            data: recipient.interface.encodeFunctionData('something', ['hello'])
        });
        await (0, chai_1.expect)(entryPoint.handleOps([(0, aa_conla_utils_1.packUserOp)(op)], beneficiary)).to.emit(recipient, 'Sender')
            .withArgs(withArgs_1.anyValue, accountAddress, 'hello');
        (0, chai_1.expect)(await provider.getCode(accountAddress).then(code => code.length)).to.greaterThan(100);
        accountDeployed = true;
    });
    context('#rethrowError', () => {
        let userOp;
        before(async () => {
            userOp = await api.createUnsignedUserOp({
                target: hardhat_1.ethers.constants.AddressZero,
                data: '0x'
            });
            // expect FailedOp "invalid signature length"
            userOp.signature = '0x11';
        });
        it('should parse FailedOp error', async () => {
            (0, chai_1.expect)(await entryPoint.handleOps([(0, aa_conla_utils_1.packUserOp)(userOp)], beneficiary).catch(aa_conla_utils_1.decodeRevertReason))
                .to.eql('FailedOpWithRevert(0,"AA23 reverted",ECDSAInvalidSignatureLength(1))');
        });
        it('should parse Error(message) error', async () => {
            await (0, chai_1.expect)(entryPoint.addStake(0)).to.revertedWith('must specify unstake delay');
        });
        it('should parse revert with no description', async () => {
            // use wrong signature for contract..
            const wrongContract = entryPoint.attach(recipient.address);
            await (0, chai_1.expect)(wrongContract.addStake(0)).to.revertedWithoutReason();
        });
    });
    it('should use account API after creation without a factory', async function () {
        if (!accountDeployed) {
            this.skip();
        }
        const api1 = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            accountAddress,
            owner
        });
        const op1 = await api1.createSignedUserOp({
            target: recipient.address,
            data: recipient.interface.encodeFunctionData('something', ['world'])
        });
        await (0, chai_1.expect)(entryPoint.handleOps([(0, aa_conla_utils_1.packUserOp)(op1)], beneficiary)).to.emit(recipient, 'Sender')
            .withArgs(withArgs_1.anyValue, accountAddress, 'world');
    });
});
//# sourceMappingURL=1-SimpleAccountAPI.test.js.map