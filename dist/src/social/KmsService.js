"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmsService = exports.KmsService = void 0;
const credential_providers_1 = require("@aws-sdk/credential-providers");
const SocialConfig_1 = require("./SocialConfig");
const client_kms_1 = require("@aws-sdk/client-kms");
class KmsService {
    async getKmsClient(idToken) {
        const credentials = (0, credential_providers_1.fromCognitoIdentityPool)({
            clientConfig: { region: SocialConfig_1.REGION },
            identityPoolId: SocialConfig_1.IDENTITY_POOL_ID,
            logins: {
                [`cognito-idp.${SocialConfig_1.REGION}.amazonaws.com/${SocialConfig_1.USER_POOL_ID}`]: idToken,
            },
        });
        return new client_kms_1.KMSClient({
            region: SocialConfig_1.REGION,
            credentials,
        });
    }
    ;
    async encryptPrivateKey(privateKey, idToken) {
        try {
            const client = await this.getKmsClient(idToken);
            const command = new client_kms_1.EncryptCommand({
                KeyId: SocialConfig_1.KMS_KEY_ID,
                Plaintext: Buffer.from(privateKey, "utf-8")
            });
            const privateKeyHashedRes = await client.send(command);
            // convert private key hash to hex string
            const privateKeyHexHashed = Array.from(privateKeyHashedRes.CiphertextBlob)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return privateKeyHexHashed;
        }
        catch (e) {
            console.log(e);
        }
    }
    async decryptPrivateKey(privateKeyHashed, idToken) {
        var _a;
        try {
            const client = await this.getKmsClient(idToken);
            const command = new client_kms_1.DecryptCommand({
                CiphertextBlob: Buffer.from(privateKeyHashed, "hex"),
            });
            const data = await client.send(command); // Plaintext ascii returned
            const asciiArray = ((_a = data.Plaintext) === null || _a === void 0 ? void 0 : _a.toString().split(",").map(Number)) || [];
            const privateKeyOrigin = asciiArray
                .map((code) => String.fromCharCode(code))
                .join("");
            return privateKeyOrigin;
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.KmsService = KmsService;
exports.kmsService = new KmsService();
//# sourceMappingURL=KmsService.js.map