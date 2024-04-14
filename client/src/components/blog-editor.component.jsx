import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../imgs/logo.png';
import defaultBanner from '../imgs/blog banner.png';
import darkLogo from '../imgs/logo-dark.png';
import lightLogo from '../imgs/logo-light.png';
import lightBanner from '../imgs/blog_banner_light.png';
import darkBanner from '../imgs/blog_banner_dark.png';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { uploadImage } from '../common/aws';
import BlogContext from '../common/blog-context';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './tools.component';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { ThemeContext } from '../common/theme-context';

const BlogEditor = () => {

    const bannerRef = useRef(null);
    const { state: { blog_id, title, banner, content, text_editor_state, tags: { tag_list }, des: { value } }, dispatch } = useContext(BlogContext);

    const navigate = useNavigate();
    const textEditorRef = useRef();
    const titleRef = useRef();


    const handleBannerUpload = async (e) => {
        let img = e.target.files[0];

        if (!img) return;

        let loading = toast.loading('Uploading banner...');
        try {
            let url = await uploadImage(img);

            toast.dismiss(loading);
            toast.success('Banner uploaded successfully!');
            dispatch({
                type: 'SET_BANNER',
                payload: url
            })
            bannerRef.current.src = url;
        } catch (error) {
            toast.dismiss(loading);
            toast.error('Failed to upload banner!');
            return;
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;
        dispatch({
            type: 'SET_TITLE',
            payload: input.value
        })
    }

    useEffect(() => {

        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = (titleRef.current.scrollHeight) + 'px';

        dispatch({
            type: 'SET_TEXT_EDITOR_STATE',
            payload: {
                is_ready: true,
                editor: new EditorJS({
                    holder: textEditorRef.current,
                    data: Array.isArray(content) ? content[0] : content,
                    tools: EDITOR_JS_TOOLS,
                    placeholder: "Let's write an awsome story"
                }),
            },
        })
    }, []);

    const {theme, setTheme} = useContext(ThemeContext);

    const handlePublish = (e) => {
        e.preventDefault();

        if (!banner) {
            toast.error('Please add a banner!');
            return;
        }

        if (!title) {
            toast.error('Please add a title!');
            return;
        }

        if (text_editor_state.is_ready) {
            text_editor_state.editor.save().then((outputData) => {
                if (!outputData.blocks.length) {
                    toast.error('Please add some content!');
                    return;
                } else {
                    dispatch({
                        type: 'SET_CONTENT',
                        payload: outputData
                    })

                    dispatch({
                        type: 'SET_EDITOR_STATE',
                        payload: 'publish'
                    })
                }
            }).catch((error) => {
            });
        }
    }

    const handleSaveDraft = (e) => {
        e.preventDefault();

        if (!banner) {
            toast.error('Please add a banner!');
            return;
        }

        if (!title) {
            toast.error('Please add a title!');
            return;
        }

        if (text_editor_state.is_ready) {
            text_editor_state.editor.save().then((outputData) => {
                if (!outputData.blocks.length) {
                    toast.error('Please add some content!');
                    return;
                } else {
                    dispatch({
                        type: 'SET_CONTENT',
                        payload: outputData
                    })

                    const endpoint = endpoints['create-blog'];
                    const promise = new ApiCaller(endpoint, methods.post, {
                        title,
                        banner,
                        content,
                        des: value,
                        tags: tag_list,
                        draft: true,
                    });

                    let loading = toast.loading('Saving draft...');

                    (async () => {
                        try {
                            await promise;
                            toast.dismiss(loading);
                            toast.success('Blog saved successfully!');
                            setTimeout(() => {
                                navigate('/');
                            }, 500);
                        } catch (error) {
                            toast.dismiss(loading);
                            toast.error(error.message);
                        }
                    })()
                }
            }).catch((error) => {
            });
        }
    }

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className="flex-none w-10">
                <img className='flex-none w-10' src={theme == "light" ? darkLogo : lightLogo} alt={import.meta.env.VITE_APP_NAME} />
                </Link>
                <p className='max-md:hidden'>
                    {title ? title : 'Untitled'}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2' onClick={handlePublish}>
                        Publish
                    </button>
                    {
                        !blog_id ? <button className='btn-light py-2' onClick={handleSaveDraft}>
                            Save Draft
                        </button> : ""
                    }

                </div>
            </nav>
            <AnimationWrapper>
                <Toaster />
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={banner ? banner : theme == "light" ? lightBanner : darkBanner} className='hover:cursor-pointer' ref={bannerRef} />
                                <input
                                    id="uploadBanner"
                                    type='file'
                                    accept='.png,.jpg,.jpeg'
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            ref={titleRef}
                            placeholder='Blog Title'
                            defaultValue={title ? title : ""}
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                            onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className='w-full opacity-10 my-5' />

                        <div id="textEditor" ref={textEditorRef} className="font-gelasio"></div>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor