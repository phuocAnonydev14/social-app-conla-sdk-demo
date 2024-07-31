import { UserSocial } from "./UserSocial";
import { AuthSocial } from "./AuthSocial";
import { SocialRedirectUri } from "../types/social.type";
export declare class SocialAuth {
    readonly user?: UserSocial;
    readonly auth: AuthSocial;
    constructor(redirectUri: SocialRedirectUri, redirectSignedOut?: string);
}
