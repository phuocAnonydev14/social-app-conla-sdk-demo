"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePrivateKey = void 0;
const validatePrivateKey = (key) => {
    const regex = /^[a-f0-9]{64}$/;
    return regex.test(key);
};
exports.validatePrivateKey = validatePrivateKey;
//# sourceMappingURL=utils.js.map