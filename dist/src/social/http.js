"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpConfig = exports.fetchWithToken = void 0;
const SocialConfig_1 = require("./SocialConfig");
const fetchWithToken = async (endpoint, token) => {
    const response = await fetch(`${SocialConfig_1.API_BASE_URL}${endpoint}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.json();
};
exports.fetchWithToken = fetchWithToken;
const httpConfig = (token) => ({
    headers: {
        Authorization: "Bearer " + token,
    },
});
exports.httpConfig = httpConfig;
//# sourceMappingURL=http.js.map