import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../common/context'
import { useNavigate } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import BlogContext from '../common/blog-context';

const Editor = () => {

    const navigate = useNavigate();
    let {user:{access_token}} = useContext(UserContext);
    let {state:{editor_state}} = useContext(BlogContext);

    useEffect(() => { 
        if(access_token == null){
            navigate('/signin');
        }
    },[access_token]);

  return (
    <>
        {
            editor_state == "editor" ? <BlogEditor/> : <PublishForm/>
        }
    </>
  )
}

export default Editor