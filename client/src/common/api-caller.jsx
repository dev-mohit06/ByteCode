import axios from "axios";
import { lookInSession } from "./session";

class ApiCaller {

    constructor(endpoint, method, data) {
        this.__baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/api';
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
                "Authorization" : JSON.parse(lookInSession('user')) ? JSON.parse(lookInSession('user')).access_token : '',
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
};

export const methods = {
    "post": "post",
    "get": "get",
    "put": "put",
    "delete": "delete",
};

export default ApiCaller;