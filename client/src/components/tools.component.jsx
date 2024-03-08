import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
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
    embed: {
        class: Embed,
        inlineToolbar: true
    },
    table: {
        class: Table,
        inlineToolbar: true
    },
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            }
        }
    },
    raw: Raw,
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
    marker: {
        class: Marker,
        inlineToolbar: true,
        config: {
            placeholder: 'Enter a marker',
            marker: 'Highlight...',
        }
    },
    delimiter: {
        class: Delimiter,
        inlineToolbar: true,
        config: {
            placeholder: 'Enter a delimiter',
            delimiter: ['---', '***', '___']
        }
    },
    inlineCode: InlineCode,
    simpleImage: SimpleImage
}
