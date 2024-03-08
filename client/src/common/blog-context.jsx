import { createContext, useReducer } from "react";

const blogStructure = {
    title : '',
    banner : '',
    content : {},
    tags : {
        tagLimit : 10,
        tag_list : [],
    },
    des: {
        characterLimit : 200,
        value : '',
        remaining : 200,
    },
    author : {
        personal_info : {}
    },
    editor_state : "editor",
    text_editor_state : {
        is_ready : false,
        editor : null,
    },
}

const BlogContext = createContext(blogStructure);

const blogReducer = (state,action) => {
    switch(action.type){
        case 'SET_TITLE':
            return {
                ...state,
                title : action.payload
            }
        case 'SET_BANNER':
            return {
                ...state,
                banner : action.payload
            }
        case 'SET_CONTENT':
            return {
                ...state,
                content : action.payload
            }
        case 'SET_TAGS':
            return {
                ...state,
                tags : { ...state.tags, ...action.payload }
            }
        case 'SET_DES':
            return {
                ...state,
                des : { ...state.des, ...action.payload}
            }
        case 'SET_AUTHOR':
            return {
                ...state,
                author : action.payload
            }
        case 'SET_EDITOR_STATE':
            return {
                ...state,
                editor_state : action.payload
            }
        case 'SET_TEXT_EDITOR_STATE':
            return {
                ...state,
                text_editor_state : {...state.text_editor_state,...action.payload}
            }
        default:
            return state
    }
}


export const BlogProvider = ({children}) => {
    const [state,dispatch] = useReducer(blogReducer,blogStructure);

    return (
        <BlogContext.Provider value={{state,dispatch}}>
            {children}
        </BlogContext.Provider>
    )
}

export default BlogContext;