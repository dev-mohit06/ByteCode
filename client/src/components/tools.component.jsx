import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import { uploadImage } from '../common/aws'


const uploadImageByURL = async (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        } catch (error) {
            reject(error);
        }
    });

    return link.then((res) => {
        return {
            success: 1,
            file: {
                url: res
            }
        };
    });
}

const uploadImageByFile =  async (file) => {
    try{
        let url = await uploadImage(file);
        return {
            success: 1,
            file: {
                url : url
            }
        };
    }catch(error){
        throw error;
    }
}


export const EDITOR_JS_TOOLS = {
    list: List,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            }
        }
    },
    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: 'Enter a heading',
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
        }
    },
}
