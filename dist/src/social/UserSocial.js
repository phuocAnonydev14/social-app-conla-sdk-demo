"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocial = void 0;
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const auth_1 = require("aws-amplify/auth");
const axios_1 = __importDefault(require("axios"));
const SocialConfig_1 = require("./SocialConfig");
const KmsService_1 = require("./KmsService");
const http_1 = require("./http");
class UserSocial {
    constructor() {
        this.encryptionKeys = [];
    }
    async getTokens(code) {
        var _a, _b;
        try {
            if (code) {
                console.log(code);
            }
            const tokenCognito = await (0, auth_1.fetchAuthSession)();
            if (!tokenCognito || !tokenCognito.tokens) {
                throw new Error("User is not authorized");
            }
            return {
                idToken: ((_a = tokenCognito.tokens.idToken) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                accessToken: ((_b = tokenCognito.tokens.accessToken) === null || _b === void 0 ? void 0 : _b.toString()) || "",
            };
        }
        catch (e) {
            throw e;
        }
    }
    async getInformation(code) {
        var _a, _b;
        try {
            if (code) {
                console.log(code);
            }
            const tokenCognito = await this.getTokens(code);
            const userResponse = await axios_1.default.get(`${SocialConfig_1.API_BASE_URL}/me`, (0, http_1.httpConfig)(tokenCognito.idToken));
            const encryptionKey = await axios_1.default.get(`${SocialConfig_1.API_BASE_URL}/keys`, (0, http_1.httpConfig)(tokenCognito.idToken));
            const formatedEncryptionKey = (_a = encryptionKey === null || encryptionKey === void 0 ? void 0 : encryptionKey.data) === null || _a === void 0 ? void 0 : _a.data.map((key) => {
                return {
                    name: key.name,
                    id: key.id,
                    encryptedKey: key.encryption_key,
                    created_at: key.created_at,
                    updated_at: key.updated_at,
                };
            });
            const { email, id, created_at, updated_at } = (_b = userResponse === null || userResponse === void 0 ? void 0 : userResponse.data) === null || _b === void 0 ? void 0 : _b.data;
            this.setInformation(email, id, formatedEncryptionKey, created_at, created_at);
            return Object.assign({ user: {
                    id: id,
                    email,
                    encryptedKey: formatedEncryptionKey,
                    createdAt: created_at,
                    updatedAt: updated_at,
                } }, tokenCognito);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async checkToken(idToken) {
        try {
            let idTokenDispatch = idToken;
            if (!idTokenDispatch) {
                idTokenDispatch = (await this.getTokens()).idToken;
            }
            return idTokenDispatch;
        }
        catch (e) {
            return "";
        }
    }
    async deletePrivateKey(keyId, idToken) {
        try {
            return await axios_1.default.delete(`${SocialConfig_1.API_BASE_URL}/keys/${keyId}`, (0, http_1.httpConfig)(idToken));
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    setInformation(email, id, encryptionKey, createdAt, updatedAt) {
        this.email = email;
        this.id = id;
        this.encryptionKeys = encryptionKey || [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    async generatePrivateKey(name, idToken) {
        try {
            console.log("start generate private key sdk");
            const idTokenDispatch = await this.checkToken(idToken);
            const provider = new providers_1.JsonRpcProvider("https://aa-bundler.conla.com/rpc");
            const wallet = ethers_1.Wallet.createRandom(provider);
            const privateKey = wallet.privateKey;
            console.log("start hash private key sdk");
            await this.hashAndUpdatePrivateKey(privateKey, idTokenDispatch, name);
            return privateKey;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async hashAndUpdatePrivateKey(privateKey, idToken, name) {
        var _a, _b, _c;
        try {
            const privateKeyHashed = await KmsService_1.kmsService.encryptPrivateKey(privateKey, idToken);
            if (!privateKeyHashed) {
                throw new Error("Hash private key failed");
            }
            let privateKeyName = name;
            if (!privateKeyName) {
                privateKeyName = `Conla account ${(((_a = this.encryptionKeys) === null || _a === void 0 ? void 0 : _a.length) || 0) + 1}`;
            }
            console.log("start post");
            const res = await axios_1.default.post(`${SocialConfig_1.API_BASE_URL}/keys`, {
                encryption_key: privateKeyHashed,
                name: privateKeyName,
                address: ethers_1.ethers.utils.computeAddress(privateKey),
            }, {
                headers: {
                    Authorization: "Bearer " + idToken,
                },
            });
            if ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.encryption_key) {
                this.encryptionKeys = (_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.encryption_key;
            }
        }
        catch (e) { }
    }
    async getPrivateKey(idToken) {
        try {
            const idTokenDispatch = await this.checkToken(idToken);
            if (!this.encryptionKeys) {
                return [];
            }
            const privateKey = await KmsService_1.kmsService.decryptPrivateKey(this.encryptionKeys, idTokenDispatch);
            return privateKey;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async syncPrivateKey(privateKey, idToken, name) {
        try {
            const idTokenDispatch = await this.checkToken(idToken);
            await this.hashAndUpdatePrivateKey(privateKey, idTokenDispatch, name);
            return privateKey;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.UserSocial = UserSocial;
//# sourceMappingURL=UserSocial.js.map