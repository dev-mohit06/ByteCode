import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../common/context'
import { useNavigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import BlogContext from '../common/blog-context';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import Loader from '../components/loader.component';

const Editor = () => {

    let {blog_id} = useParams();

    const navigate = useNavigate();
    let {user:{access_token}} = useContext(UserContext);
    let {state,state:{editor_state},dispatch} = useContext(BlogContext);
    let [loading,setLoading] = useState(true);

    useEffect(() => {

        if(access_token == null){
            navigate('/signin');
        }

        if(blog_id){
            (async () => {
                let securityPromise = new ApiCaller(endpoints['verify-blog-before-edit'],methods.post,{
                    blog_id : blog_id
                });    
        
                const response = (await securityPromise).data;
                setLoading(false);
                if(!response){
                    navigate('/');
                }else{
                    console.log(response);
                    dispatch({
                        type : 'SET_BLOG_ID',
                        payload : response.blog_id
                    });
                    dispatch({
                        type : 'SET_TITLE',
                        payload : response.title
                    });
                    dispatch({
                        type : 'SET_BANNER',
                        payload : response.banner
                    });
                    dispatch({
                        type : 'SET_CONTENT',
                        payload : response.content
                    });
                    dispatch({
                        type : 'SET_TAGS',
                        payload : {tag_list : response.tags},
                    });
                    dispatch({
                        type : 'SET_DES',
                        payload : {value : response.des,remaining: import.meta.env.VITE_MAX_DES_LIMIT - response.des.length,characterLimit: import.meta.env.VITE_MAX_DES_LIMIT},
                    });
                    dispatch({
                        type : 'SET_AUTHOR',
                        payload : response.author,
                    });
                }
            })()
        }else{
            setLoading(false);
        }

    },[access_token]);

  return (
    <>
        {
            loading ? <Loader/> : editor_state == "editor" ? <BlogEditor/> : <PublishForm/>
        }
    </>
  )
}

export default Editor