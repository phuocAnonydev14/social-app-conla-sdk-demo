"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = exports.SocialConfig = exports.KMS_KEY_ID = exports.IDENTITY_POOL_ID = exports.USER_POOL_ID = exports.REGION = void 0;
const aws_amplify_1 = require("aws-amplify");
exports.REGION = "us-east-1";
exports.USER_POOL_ID = "us-east-1_N5Ae9HYY1";
exports.IDENTITY_POOL_ID = "us-east-1:9efbc98b-7284-4f53-9d38-30acbd0f71a3";
exports.KMS_KEY_ID = "1be6c2b4-739d-4d6c-85d2-ca1eb0e2275c";
exports.SocialConfig = {
    socialLoginConfig: (redirectUri) => {
        aws_amplify_1.Amplify.configure({
            Auth: {
                Cognito: {
                    // Amazon Cognito User Pool ID
                    userPoolId: exports.USER_POOL_ID,
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
exports.API_BASE_URL = "https://aa-bundler.conla.com/api/v1";
//# sourceMappingURL=SocialConfig.js.map