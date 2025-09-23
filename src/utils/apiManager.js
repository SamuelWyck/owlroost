class ApiManager {
    #apiDomain = "http://localhost:3000";


    async #makeApiCall(url, options) {
        try {
            const res = await fetch(url, options);
            const jsonRes = await res.json();
            return jsonRes;
        } catch {
            return {
                errors: [{msg: "Unable to connect to server"}]
            }
        }
    };


    async loginOrSignup(reqBody, signup) {
        const endPoint = (signup) ? "signup" : "login";
        const url = `${this.#apiDomain}/auth/${endPoint}`;
        const options = {
            mode: "cors",
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: reqBody
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async loginUser(reqBody) {
        const res = await this.loginOrSignup(reqBody, false);
        return res;
    };


    async signupUser(reqBody) {
        const res = await this.loginOrSignup(reqBody, true);
        return res;
    };


    async checkAuthStatus() {
        const url = `${this.#apiDomain}/auth/status`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };
};



export default new ApiManager();