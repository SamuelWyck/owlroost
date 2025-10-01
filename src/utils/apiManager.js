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


    async logoutUser() {
        const url = `${this.#apiDomain}/auth/logout`;
        const options = {
            mode: "cors",
            method: "POST",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
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


    async getPosts(pageNum, orderByLikes) {
        const querys = `?pageNum=${pageNum}&orderByLikes=${orderByLikes}`;
        const url = `${this.#apiDomain}/posts${querys}`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async createPost(reqBody) {
        const url = `${this.#apiDomain}/posts/new`;
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


    async getPost(postId) {
        const url = `${this.#apiDomain}/posts/${postId}`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async editPost(reqBody, postId) {
        const url = `${this.#apiDomain}/posts/${postId}/edit`;
        const options = {
            mode: "cors",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: reqBody
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async deletePost(postId) {
        const endPoint = `${postId}/delete`;
        const url = `${this.#apiDomain}/posts/${endPoint}`;
        const options = {
            mode: "cors",
            method: "DELETE",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async getPostComments(postId, pageNum) {
        const endPoint = `${postId}?pageNum=${pageNum}`;
        const url = `${this.#apiDomain}/comments/${endPoint}`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async togglePostLike(postId) {
        const url = `${this.#apiDomain}/posts/${postId}/like`;
        const options = {
            mode: "cors",
            method: "POST",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async createComment(reqBody) {
        const url = `${this.#apiDomain}/comments/new`;
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


    async deleteComment(commentId) {
        const endPoint = `${commentId}/delete`;
        const url = `${this.#apiDomain}/comments/${endPoint}`;
        const options = {
            mode: "cors",
            method: "DELETE",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async editComment(commentId, reqBody) {
        const endPoint = `${commentId}/edit`;
        const url = `${this.#apiDomain}/comments/${endPoint}`;
        const options = {
            mode: "cors",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: reqBody
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async getUserPosts(userId) {
        const url = `${this.#apiDomain}/users/${userId}/posts`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async getUserProfile(userId) {
        const url = `${this.#apiDomain}/users/${userId}`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async getUsers(pageNum, searchName="") {
        const query = `?pageNum=${pageNum}&name=${searchName}`;
        const url = `${this.#apiDomain}/users${query}`;
        const options = {
            mode: "cors",
            method: "GET",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async followUser(userId) {
        const endPoint = `/${userId}/follow`;
        const url = `${this.#apiDomain}/users${endPoint}`;
        const options = {
            mode: "cors",
            method: "POST",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };


    async unfollowUser(userId) {
        const endPoint = `/${userId}/unfollow`;
        const url = `${this.#apiDomain}/users${endPoint}`;
        const options = {
            mode: "cors",
            method: "DELETE",
            credentials: "include"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };
};



export default new ApiManager();