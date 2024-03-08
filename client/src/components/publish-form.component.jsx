import React, { useContext } from 'react'
import BlogContext from '../common/blog-context';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import Tag from './tag.component';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { useNavigate } from 'react-router-dom';

const PublishForm = () => {
  const { state: { title, banner, tags: { tagLimit, tag_list }, des: { value, remaining, characterLimit },content }, dispatch } = useContext(BlogContext);

  const navigate = useNavigate();


  const handleCloseEvent = (e) => {
    e.preventDefault();

    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: 'editor'
    });
  }

  const handleBlogTitleChange = (e) => {
    let value = e.target.value;

    if (!value) {
      toast.error('Blog title is required!');
      return;
    }

    dispatch({
      type: 'SET_TITLE',
      payload: value
    });
  }

  const handleBlogDesChange = (e) => {
    let value = e.target.value;

    dispatch({
      type: 'SET_DES',
      payload: {
        value,
        remaining: characterLimit - value.length
      }
    });

    if (!value) {
      toast.error('Blog description is required!');
      return;
    }

  }

  const handelTagSubmit = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      let tag = e.target.value.toLowerCase();


      if (!tag) {
        toast.error('Tag is required!');
        return;
      }

      if (tag_list.length >= tagLimit) {
        toast.error(`You can only add ${tagLimit} tags!`);
        return;
      }

      if (tag_list.includes(tag)) {
        toast.error(`Tag ${tag} already added!`);
        return;
      }

      dispatch({
        type: 'SET_TAGS',
        payload: {
          tag_list: [...tag_list, tag]
        }
      });
      toast.success('Tag added successfully 👍');
      e.target.value = '';
    }
  }

  const handelPublish = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.error('Blog title is required!');
      return;
    }

    if (!value) {
      toast.error('Blog description is required!');
      return;
    }

    if (tag_list.length < 1) {
      toast.error('At least one tag is required!');
      return;
    }

    let loading = toast.loading('Publishing your blog...');

    const endpoint = endpoints['create-blog'];
    const promise = new ApiCaller(endpoint,methods.post,{
      title,
      banner,
      content,
      des : value,
      tags : tag_list,
    });

    try{
      const response = await promise;
      toast.dismiss(loading);
      toast.success(response.message);
      setTimeout(() => {
        navigate('/');
      }, 500);
    }catch(error){
      toast.dismiss(loading);
      toast.error(error.message);
    }
  }

  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>

        <Toaster></Toaster>

        <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleCloseEvent}>
          <i className="fi fi-br-cross"></i>
        </button>

        <div className='max-w-[550px] center'>
          <p className="text-dark-grey mb-1">
            Preview
          </p>

          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} alt={title} />
          </div>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>

          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{value}</p>
        </div>

        <div className='border-grey lg:border-1 lg:top-[10%]'>
          <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input type="text" placeholder='Blog Title' defaultValue={title} className='input-box pl-4' onChange={handleBlogTitleChange} />

          <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
          <textarea
            maxLength={characterLimit}
            defaultValue={value}
            className='h-40 resize-none input-box pl-4'
            onChange={handleBlogDesChange}
            onKeyDown={(e) => e.key == 'Enter' ? e.preventDefault() : null}
          ></textarea>
          <p className='mt-1 text-dark-grey text-sm text-right'>{remaining} are character left</p>

          <p className='text-dark-grey mb-2 mt-9'>Topics - (Helps is searching and ranking your blog post)</p>
          <div className='relative input-box pl-2 py-2 pb-4'>
            <input type="text" placeholder='Topic' className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={handelTagSubmit} />
            {
              tag_list.map((tag, index) => {
                return <Tag key={index} tag={tag} />
              })
            }
          </div>
          <p className='mt-1 text-dark-grey text-sm text-right'>{tagLimit - tag_list.length} are tags left</p>

          <button className='btn-dark px-8' onClick={handelPublish}>Publish</button>
        </div>

      </section>
    </AnimationWrapper>
  )
}

export default PublishForm