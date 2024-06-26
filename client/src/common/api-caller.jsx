import axios from "axios";
import { lookInSession } from "./session";

class ApiCaller {

    constructor(endpoint, method, data) {
        const env = import.meta.env;
        this.__baseUrl = env.VITE_ENV == 'devlopment' ? env.VITE_DEV_SERVER_URL : env.VITE_SERVER_URL;
        this.axiosInstance = this.createAxiosInstance();
        this.endpoint = endpoint;
        this.method = method.toLowerCase();
        this.data = data;

        if (!this.isValidMethod()) {
            throw new Error('Invalid method provided. Only "get","post","put" and "delete" methods are allowed.');
        }

        if (!this.isValidEndpoint()) {
            throw new Error('Invalid endpoint provided.');
        }

        return this.call();
    }

    async call() {
        try {
            let header = this.headers ? this.headers : this.axiosInstance.defaults.headers;
            const response = await this.axiosInstance[this.method](this.endpoint, this.data, header);
            return this.filterResponse(response);
        } catch (error) {
            return this.filterResponse(error);
        }
    }

    filterResponse(response) {
        if (response instanceof Error) {
            return response.response.data;
        } else {
            return response.data;
        }
    }

    isValidMethod() {
        return Object.values(methods).includes(this.method);
    }

    isValidEndpoint() {
        return Object.values(endpoints).includes(this.endpoint);
    }

    createAxiosInstance() {
        return axios.create({
            baseURL: this.__baseUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(lookInSession('user')) ? JSON.parse(lookInSession('user')).access_token : '',
            },
        });
    }
}

export const endpoints = {
    "sign-in": '/auth/signin',
    "sign-up": '/auth/signup',
    "google-auth": '/auth/google-auth',
    "get-upload-url": '/storage/get-upload-url',
    "create-blog": '/blog/create',
    "latest-blogs": '/blog/latest',
    "trending-blogs": '/blog/trending',
    "blogs-by-category": "/blog/search-blogs",
    "all-latest-blogs-count": "/blog/all-latest-blog-count",
    "all-search-blogs-count": "/blog/serach-blog-count",
    "search-blogs": "/blog/search-blogs",
    "search-user": "/user/search",
    "user-profile": "/user/get-profile",
    "get-blog": "/blog/get-blog",
    "verify-blog-before-edit": "/blog/verify-blog",
    "like-blog": "/blog/like-blog",
    "is-liked-by-user": "/blog/is-liked-by-user",
    "add-comment": "/blog/add-comment",
    "fetch-comment": "/blog/fetch-comment",
    "fetch-replies": "/blog/fetch-replies",
    "delete-comment-or-reply": "/blog/delete-comment-or-reply",
    "change-password": "/user/change-password",
    "update-profile-img": "/user/update-profile-img",
    "update-profile": "/user/update-profile",
    "get-new-notifications": "/notification/new-notifications",
    "get-all-notifications": "/notification/",
    "get-all-notifications-count": "/notification/all-notifications-count",
    "get-user-blogs": "/blog/get-user-blogs",
    "get-user-blogs-count": "/blog/get-user-blogs-count",
    "delete-blog": "/blog/delete-blog",
};

export const methods = {
    "post": "post",
    "get": "get",
    "put": "put",
    "delete": "delete",
};

export default ApiCaller;