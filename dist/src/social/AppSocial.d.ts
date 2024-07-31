import { UserSocial } from "./UserSocial";
import { AuthSocial } from "./AuthSocial";
export declare class AppSocial {
    readonly user?: UserSocial;
    readonly auth: AuthSocial;
    constructor(redirectSignedIn: string, redirectSignedOut: string);
}
