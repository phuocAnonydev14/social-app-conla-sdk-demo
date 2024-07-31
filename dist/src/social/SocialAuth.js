"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuth = void 0;
const SocialConfig_1 = require("./SocialConfig");
const UserSocial_1 = require("./UserSocial");
const AuthSocial_1 = require("./AuthSocial");
class SocialAuth {
    constructor(redirectUri, redirectSignedOut) {
        SocialConfig_1.SocialConfig.socialLoginConfig(redirectUri);
        this.auth = new AuthSocial_1.AuthSocial(redirectUri);
        this.user = new UserSocial_1.UserSocial();
    }
}
exports.SocialAuth = SocialAuth;
//# sourceMappingURL=SocialAuth.js.map