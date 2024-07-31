import { Tokens } from "../types/social.type";
export declare class UserSocial {
    email?: string;
    id?: string;
    encryptionKey?: string;
    createdAt?: string;
    updatedAt?: string;
    getTokens(code?: string): Promise<Tokens>;
    getInformation: (code?: string) => Promise<{
        idToken: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            encryptionKey: any;
            created_at: any;
            updatedAt: any;
        };
    } | undefined>;
    setInformation(email: string, id: string, encryptionKey?: string, createdAt?: string, updatedAt?: string): void;
    generatePrivateKey(): Promise<string | undefined>;
    getPrivateKey(): Promise<string | null | undefined>;
}
