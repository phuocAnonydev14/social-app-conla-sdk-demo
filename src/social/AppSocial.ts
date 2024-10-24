import { SocialConfig } from "./SocialConfig";
import { UserSocial } from "./UserSocial";
import { AuthSocial } from "./AuthSocial";
import { SocialRedirectUri } from "../types/social.type";

export class AppSocial {
  public readonly user?: UserSocial;
  public readonly auth: AuthSocial;


  constructor(redirectSignedIn:  string, redirectSignedOut: string) {
    const redirectUri: SocialRedirectUri = {
      redirectSignedIn,
      redirectSignedOut
    }
    SocialConfig.socialLoginConfig(redirectUri);
    this.auth = new AuthSocial(redirectUri);
    this.user = new UserSocial();
  }
}
