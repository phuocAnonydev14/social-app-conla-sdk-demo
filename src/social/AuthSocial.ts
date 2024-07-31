import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import {SocialRedirectUri} from "../types/social.type";

export class AuthSocial {
  public readonly redirectUri: SocialRedirectUri;

  constructor(redirectUri: SocialRedirectUri) {
    this.redirectUri = redirectUri;
  }

  loginGoogle = async () => {
    try {
      await signInWithRedirect({
        provider: "Google",
      });
    } catch (e) {
      console.log(e);
    }
  };

  logout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e);
    }
  };
}
