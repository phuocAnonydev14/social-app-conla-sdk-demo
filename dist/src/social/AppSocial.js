"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSocial = void 0;
const SocialConfig_1 = require("./SocialConfig");
const UserSocial_1 = require("./UserSocial");
const AuthSocial_1 = require("./AuthSocial");
class AppSocial {
    constructor(redirectSignedIn, redirectSignedOut) {
        const redirectUri = {
            redirectSignedIn,
            redirectSignedOut
        };
        SocialConfig_1.SocialConfig.socialLoginConfig(redirectUri);
        this.auth = new AuthSocial_1.AuthSocial(redirectUri);
        this.user = new UserSocial_1.UserSocial();
    }
}
exports.AppSocial = AppSocial;
//# sourceMappingURL=AppSocial.js.map