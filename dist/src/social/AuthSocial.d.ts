import { SocialRedirectUri } from "../types/social.type";
export declare class AuthSocial {
    readonly redirectUri: SocialRedirectUri;
    constructor(redirectUri: SocialRedirectUri);
    loginGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}
