"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppSocial_1 = require("./AppSocial");
const socialExample = async () => {
    var _a, _b, _c, _d;
    try {
        const appSocial = new AppSocial_1.AppSocial("http://localhost:3000/oauth", "http://localhost:3000");
        // handle login
        await appSocial.auth.loginGoogle();
        // in redirect page => get information of user
        // if you get "code" in query router, pass to param function
        const code = "asdksjafhdfkjsdhjkfhsdfhdsf"; // demo code
        const response = await ((_a = appSocial.user) === null || _a === void 0 ? void 0 : _a.getInformation(code));
        const user = response.user;
        /*
        user {
          id
          email
          encryptionKey
          createdAt
          updatedAt
        }
         */
        // or if you only want to get tokens
        const tokens = await ((_b = appSocial.user) === null || _b === void 0 ? void 0 : _b.getTokens()); // return access token & id token
        // if your account didn't get private key => field generationKey will be "null"
        if (!user.encryptedKey) {
            // handle generate private key
            const privateKey = await ((_c = appSocial.user) === null || _c === void 0 ? void 0 : _c.generatePrivateKey());
            console.log(privateKey);
        }
        // if you already get private key => get it
        const privateKey = await ((_d = appSocial.user) === null || _d === void 0 ? void 0 : _d.getPrivateKey());
        console.log(privateKey);
        // logout function
        await appSocial.auth.logout();
    }
    catch (e) {
        console.log(e);
    }
};
//# sourceMappingURL=example.js.map