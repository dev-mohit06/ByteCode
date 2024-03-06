import axios from "axios";

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
            const response = this.method === 'post' ? await this.axiosInstance.post(this.endpoint, this.data) : await this.axiosInstance.get(this.endpoint);
            return this.filterResponse(response);
        } catch (error) {
            return this.filterResponse(error);
        }
    }

    filterResponse(response){
        if(response instanceof Error){
            return response.response.data;
        }else{
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
                "Content-Type": "application/json"
            },
        });
    }
}

export const endpoints = {
    "sign-in": '/auth/signin',
    "sign-up": '/auth/signup',
    "google-auth": '/auth/google-auth',
};

export const methods = {
    "post" : "post",
    "get" : "get",
    "put" : "put",
    "delete" : "delete",
};

export default ApiCaller;