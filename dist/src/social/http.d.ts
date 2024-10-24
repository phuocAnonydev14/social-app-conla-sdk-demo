export declare const fetchWithToken: (endpoint: string, token: string) => Promise<any>;
export declare const httpConfig: (token: string) => {
    headers: {
        Authorization: string;
    };
};
