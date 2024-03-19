import axios from "axios";
import ApiCaller, { endpoints, methods } from "./api-caller";
import { lookInSession } from "./session";

export const uploadImage = async (file, folder_name) => {

    if (!folder_name) {
        folder_name = "blog_banners";
    }

    let method = methods.post;
    let endpoint = endpoints['get-upload-url'];

    let promise = new ApiCaller(endpoint, method, {
        folder_name
    });
    let url = (await promise).data;

    try {
        await axios.put(url, file, {
            headers: {
                'Content-Type': file.type,
            }
        });

        return url.split('?')[0];
    } catch (error) {
        throw error;
    }
}