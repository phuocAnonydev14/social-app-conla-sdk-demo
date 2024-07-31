"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAccountAPI = void 0;
const ethers_1 = require("ethers");
const aa_conla_utils_1 = require("aa-conla-utils");
const utils_1 = require("ethers/lib/utils");
const BaseAccountAPI_1 = require("./BaseAccountAPI");
/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
class SimpleAccountAPI extends BaseAccountAPI_1.BaseAccountAPI {
    constructor(params) {
        var _a;
        super(params);
        this.factoryAddress = params.factoryAddress;
        this.owner = params.owner;
        this.index = ethers_1.BigNumber.from((_a = params.index) !== null && _a !== void 0 ? _a : 0);
        this.beneficiaryAddress = ethers_1.ethers.constants.AddressZero;
        this.beneficiaryAddress = "0xEE35dA6bA29cc1A60d0d9042fa8c88CbEA6d12c0";
        this.entrypointAddress = params.entryPointAddress;
        this.bundlerUrl = params.bundlerUrl;
    }
    async _getAccountContract() {
        if (this.accountContract == null) {
            this.accountContract = aa_conla_utils_1.SimpleAccount__factory.connect(await this.getAccountAddress(), this.provider);
        }
        return this.accountContract;
    }
    /**
     * return the value to put into the "initCode" field, if the account is not yet deployed.
     * this value holds the "factory" address, followed by this account's information
     */
    async getFactoryData() {
        if (this.factory == null) {
            if (this.factoryAddress != null && this.factoryAddress !== "") {
                this.factory = aa_conla_utils_1.SimpleAccountFactory__factory.connect(this.factoryAddress, this.provider);
            }
            else {
                throw new Error("no factory to get initCode");
            }
        }
        return {
            factory: this.factory.address,
            factoryData: this.factory.interface.encodeFunctionData("createAccount", [
                await this.owner.getAddress(),
                this.index,
            ]),
        };
    }
    async getNonce() {
        if (await this.checkAccountPhantom()) {
            return ethers_1.BigNumber.from(0);
        }
        const accountContract = await this._getAccountContract();
        return await accountContract.getNonce();
    }
    /**
     * encode a method call from entryPoint to our contract
     * @param target
     * @param value
     * @param data
     */
    async encodeExecute(target, value, data) {
        const accountContract = await this._getAccountContract();
        return accountContract.interface.encodeFunctionData("execute", [
            target,
            value,
            data,
        ]);
    }
    async signUserOpHash(userOpHash) {
        return await this.owner.signMessage((0, utils_1.arrayify)(userOpHash));
    }
    async sendHandlerOps(ops) {
        const convertUserOperation = (op) => {
            return {
                sender: op.sender,
                nonce: Number(op.nonce),
                initCode: op.initCode,
                callData: op.callData,
                callGasLimit: Number(op.callGasLimit),
                verificationGasLimit: Number(op.verificationGasLimit),
                maxFeePerGas: Number(op.maxFeePerGas),
                maxPriorityFeePerGas: Number(op.maxPriorityFeePerGas),
                paymasterAndData: op.paymasterData,
                preVerificationGas: Number(op.preVerificationGas),
                signature: op.signature,
                paymasterVerificationGasLimit: Number(op.paymasterVerificationGasLimit),
                paymasterPostOpGasLimit: Number(op.paymasterPostOpGasLimit),
                paymaster: op.paymaster,
                entryPoint: this.entrypointAddress,
            };
        };
        const params = ops.map(convertUserOperation);
        const response = await fetch(this.bundlerUrl + "/api/v1/bundler/userop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: params,
            }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const responseData = await response.json();
        return responseData.data;
    }
}
exports.SimpleAccountAPI = SimpleAccountAPI;
//# sourceMappingURL=SimpleAccountAPI.js.map