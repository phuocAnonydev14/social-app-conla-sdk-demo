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
class UserSocial {
    constructor() {
        this.getInformation = async (code) => {
            var _a;
            try {
                if (code) {
                    console.log(code);
                }
                const tokenCognito = await this.getTokens(code);
                const userResponse = await axios_1.default.get(`${SocialConfig_1.API_BASE_URL}/me`, {
                    headers: {
                        Authorization: "Bearer " + tokenCognito.idToken
                    }
                });
                const { email, id, encryption_key, created_at, updated_at } = (_a = userResponse === null || userResponse === void 0 ? void 0 : userResponse.data) === null || _a === void 0 ? void 0 : _a.data;
                this.setInformation(email, id, encryption_key, created_at, created_at);
                return Object.assign({ user: {
                        id: id,
                        email,
                        encryptionKey: encryption_key,
                        created_at: created_at,
                        updatedAt: updated_at
                    } }, tokenCognito);
            }
            catch (e) {
                console.log(e);
            }
        };
    }
    async getTokens(code) {
        var _a, _b;
        if (code) {
            console.log(code);
        }
        const tokenCognito = await (0, auth_1.fetchAuthSession)();
        if (!tokenCognito || !tokenCognito.tokens) {
            throw new Error("User is not authorized");
        }
        return {
            idToken: ((_a = tokenCognito.tokens.idToken) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            accessToken: ((_b = tokenCognito.tokens.accessToken) === null || _b === void 0 ? void 0 : _b.toString()) || '',
        };
    }
    setInformation(email, id, encryptionKey, createdAt, updatedAt) {
        this.email = email;
        this.id = id;
        this.encryptionKey = encryptionKey;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    async generatePrivateKey() {
        var _a, _b;
        try {
            const idToken = (await this.getTokens()).idToken;
            const provider = new providers_1.JsonRpcProvider("https://aa-bundler.conla.com/rpc");
            const wallet = ethers_1.Wallet.createRandom(provider);
            const privateKey = wallet.privateKey;
            const privateKeyHashed = await KmsService_1.kmsService.encryptPrivateKey(privateKey, idToken);
            if (!privateKeyHashed) {
                throw new Error("Hash private key failed");
            }
            const res = await axios_1.default.patch(`${SocialConfig_1.API_BASE_URL}/me/key`, {
                encryption_key: privateKeyHashed
            }, {
                headers: {
                    Authorization: "Bearer " + idToken
                }
            });
            if ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.encryption_key) {
                this.encryptionKey = (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.encryption_key;
            }
            return privateKey;
        }
        catch (e) {
            console.log(e);
        }
    }
    async getPrivateKey() {
        try {
            const idToken = (await this.getTokens()).idToken;
            if (!this.encryptionKey) {
                return null;
            }
            const privateKey = await KmsService_1.kmsService.decryptPrivateKey(this.encryptionKey, idToken);
            return privateKey;
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.UserSocial = UserSocial;
//# sourceMappingURL=UserSocial.js.map