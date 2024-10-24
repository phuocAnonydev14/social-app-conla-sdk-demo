import { Amplify } from "aws-amplify";
import { SocialRedirectUri } from "../types/social.type";



export const REGION = "us-east-1"

export const USER_POOL_ID = "us-east-1_N5Ae9HYY1"
export const IDENTITY_POOL_ID = "us-east-1:9efbc98b-7284-4f53-9d38-30acbd0f71a3"
export const KMS_KEY_ID = "1be6c2b4-739d-4d6c-85d2-ca1eb0e2275c"

export const SocialConfig = {
  socialLoginConfig: (redirectUri: SocialRedirectUri) => {
    Amplify.configure({
      Auth: {
        Cognito: {
          // Amazon Cognito User Pool ID
          userPoolId: USER_POOL_ID,

          // Amazon Cognito Web Client ID
          userPoolClientId: "3gtkehls86msq6r0uadd0vat3b",

          // Hosted UI configuration
          loginWith: {
            oauth: {
              domain: "conla-test.auth.us-east-1.amazoncognito.com",
              scopes: [
                "email",
                "openid",
                "phone"
              ],
              redirectSignIn: [redirectUri.redirectSignedIn],
              redirectSignOut: [
                redirectUri.redirectSignedOut || "http://localhost:3000",
              ],
              responseType: "code",
              providers: ["Google"],
            },
          },
        },
      },
    });
  },
};

export const API_BASE_URL = "https://aa-bundler.conla.com/api/v1"
