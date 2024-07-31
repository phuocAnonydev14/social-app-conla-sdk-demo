import { KMSClient } from "@aws-sdk/client-kms";
export declare class KmsService {
    getKmsClient(idToken: string): Promise<KMSClient>;
    encryptPrivateKey(privateKey: string, idToken: string): Promise<string | undefined>;
    decryptPrivateKey(privateKeyHashed: string, idToken: string): Promise<string | undefined>;
}
export declare const kmsService: KmsService;
