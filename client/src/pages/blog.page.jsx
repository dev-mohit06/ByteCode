import React, { createContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../components/loader.component';
import { formatDate } from '../common/date';
import BlogInteraction from '../components/blog-interaction.component';
import AnimationWrapper from '../common/page-animation';
import BlogPostCard from '../components/blog-post.component';
import BlogContent from '../components/blog-content.component';
import PageNotFound from './404.page';

const blogDS = {
  title: "",
  content: "",
  banner: "",
  author: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: ""
    }
  },
  tags: [],
  publishedAt: ""
};



export const BlogPageContext = createContext(blogDS);

const BlogPage = () => {

  const { blog_id } = useParams();
  const [blog, setBlog] = useState(blogDS);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const navigate = useNavigate();

  let { title, tags, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  const fetchBlog = async () => {
    let endpoint = endpoints["get-blog"];

    let promise = new ApiCaller(endpoint, methods.post, {
      blog_id
    });

    try {
      let blog = (await promise).data;

      if (blog === null) {
        navigate('/404');
        return;
      }

      let nestadeEndpoint = endpoints["search-blogs"];
      let nestadePromise = new ApiCaller(nestadeEndpoint, methods.post, {
        tag: blog.tags[0],
        limit: 6,
        eleminate_blog_id: blog.blog_id,
      });
      let similarBlogs = (await nestadePromise).data;
      setBlog(blog);
      setSimilarBlogs(similarBlogs);
    } catch (error) {
      toast.error('Internal Server Error Occured. Please try again later.');
    }
  }

  const resetStates = () => {
    setBlog(blogDS);
    setSimilarBlogs(null);
  }

  return (
    <>
      {
        blog.title !== ""
          ?
          <BlogPageContext.Provider value={{ blog, setBlog }}>
            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
              <img src={banner} className='aspect-video' alt={title} />

              <div className="mt-12">
                <h2>{title}</h2>
              </div>

              <div className='flex max-sm:flex-col justify-between my-8'>
                <div className='flex gap-5 items-start'>
                  <img src={profile_img} alt={author_username} className='w-12 h-12 rounded-full' />
                  <p>
                    <span className='capitalize'>{fullname}</span>
                    <br />
                    @
                    <Link className='underline' to={`/user/${author_username}`}>{author_username}</Link>
                  </p>
                </div>
                <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {formatDate(publishedAt)}</p>
              </div>

              <BlogInteraction />

              <div className="my-12 font-gelasio blog-page-content">
                {
                  blog.content[0].blocks.map((block, i) => {
                    return <div key={i} className='my-4 md:my-8'>
                      <BlogContent block={block}/>
                    </div>
                  })
                }
              </div>

              {
                similarBlogs !== null && similarBlogs.length
                ?
                <>
                  <h1 className='text-2xl mt-14 mb-10 font-me'>Similar Blogs</h1>

                  {
                    similarBlogs.map((blog,index) => {
                      let {author : {personal_info}} = blog;

                      return <AnimationWrapper key={index} transition={{
                        duration : 1,
                        delay : index * 0.08
                      }}>
                        <BlogPostCard blog={blog} author={personal_info} categorySearch={true}/>
                      </AnimationWrapper>
                    })
                  }
                </>
                :
                <></>
              }

            </div>
          </BlogPageContext.Provider>
          :
          <Loader />
      }
    </>
  )
}

export default BlogPage