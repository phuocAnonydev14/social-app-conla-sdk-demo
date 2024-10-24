import { EncryptedKey, PrivateKey, Tokens, UserSocialType } from "../types/social.type";
export declare class UserSocial {
    email?: string;
    id?: string;
    encryptionKeys?: EncryptedKey[];
    createdAt?: string;
    updatedAt?: string;
    getTokens(code?: string): Promise<Tokens>;
    getInformation(code?: string): Promise<{
        idToken: string;
        accessToken: string;
        user: UserSocialType;
    }>;
    checkToken(idToken?: string): Promise<string>;
    deletePrivateKey(keyId: string, idToken: string): Promise<import("axios").AxiosResponse<any, any>>;
    setInformation(email: string, id: string, encryptionKey?: EncryptedKey[], createdAt?: string, updatedAt?: string): void;
    generatePrivateKey(name?: string, idToken?: string): Promise<string>;
    hashAndUpdatePrivateKey(privateKey: string, idToken: string, name?: string): Promise<void>;
    getPrivateKey(idToken?: string): Promise<PrivateKey[]>;
    syncPrivateKey(privateKey: string, idToken?: string, name?: string): Promise<string>;
}
