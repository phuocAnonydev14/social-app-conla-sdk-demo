import { KMSClient } from "@aws-sdk/client-kms";
import { EncryptedKey, PrivateKey } from "../types/social.type";
export declare class KmsService {
    getKmsClient(idToken: string): Promise<KMSClient>;
    encryptPrivateKey(privateKey: string, idToken: string): Promise<string>;
    decryptPrivateKey(encryptedKeys: EncryptedKey[], idToken: string): Promise<PrivateKey[]>;
}
export declare const kmsService: KmsService;
