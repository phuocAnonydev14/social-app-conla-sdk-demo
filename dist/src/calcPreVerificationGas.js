"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcPreVerificationGas = exports.DefaultGasOverheads = void 0;
const aa_conla_utils_1 = require("aa-conla-utils");
const utils_1 = require("ethers/lib/utils");
exports.DefaultGasOverheads = {
    fixed: 21000,
    perUserOp: 18300,
    perUserOpWord: 4,
    zeroByte: 4,
    nonZeroByte: 16,
    bundleSize: 1,
    sigSize: 65
};
/**
 * calculate the preVerificationGas of the given UserOperation
 * preVerificationGas (by definition) is the cost overhead that can't be calculated on-chain.
 * it is based on parameters that are defined by the Ethereum protocol for external transactions.
 * @param userOp filled userOp to calculate. The only possible missing fields can be the signature and preVerificationGas itself
 * @param overheads gas overheads to use, to override the default values
 */
function calcPreVerificationGas(userOp, overheads) {
    const ov = Object.assign(Object.assign({}, exports.DefaultGasOverheads), (overheads !== null && overheads !== void 0 ? overheads : {}));
    const p = Object.assign({ 
        // dummy values, in case the UserOp is incomplete.
        preVerificationGas: 21000, signature: (0, utils_1.hexlify)(Buffer.alloc(ov.sigSize, 1)) }, userOp);
    const packed = (0, utils_1.arrayify)((0, aa_conla_utils_1.encodeUserOp)((0, aa_conla_utils_1.packUserOp)(p), false));
    const lengthInWord = (packed.length + 31) / 32;
    const callDataCost = packed.map(x => x === 0 ? ov.zeroByte : ov.nonZeroByte).reduce((sum, x) => sum + x);
    const ret = Math.round(callDataCost +
        ov.fixed / ov.bundleSize +
        ov.perUserOp +
        ov.perUserOpWord * lengthInWord);
    return ret;
}
exports.calcPreVerificationGas = calcPreVerificationGas;
//# sourceMappingURL=calcPreVerificationGas.js.map