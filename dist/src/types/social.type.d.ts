export interface Tokens {
    idToken: string;
    accessToken: string;
}
export interface SocialRedirectUri {
    redirectSignedIn: string;
    redirectSignedOut: string;
}
export interface UserSocial {
    email: string;
    id: string;
    encryptedKey: string;
    createdAt: string;
    updatedAt: string;
}
