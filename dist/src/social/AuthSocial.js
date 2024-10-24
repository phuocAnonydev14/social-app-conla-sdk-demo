"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSocial = void 0;
const auth_1 = require("aws-amplify/auth");
class AuthSocial {
    constructor(redirectUri) {
        this.loginGoogle = async () => {
            try {
                await (0, auth_1.signInWithRedirect)({
                    provider: "Google",
                });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        };
        this.logout = async () => {
            try {
                await (0, auth_1.signOut)();
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        };
        this.redirectUri = redirectUri;
    }
}
exports.AuthSocial = AuthSocial;
//# sourceMappingURL=AuthSocial.js.map