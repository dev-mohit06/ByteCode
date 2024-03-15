import React, { useContext, useEffect, useState } from 'react'
import { BlogPageContext } from '../pages/blog.page';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../common/context'
import toast, { Toaster } from 'react-hot-toast';
import ApiCaller, { endpoints, methods } from '../common/api-caller';

export let handleComment;

const BlogInteraction = () => {

  let { blog, blog: { _id: bmain_id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username } } }, setBlog } = useContext(BlogPageContext);

  const [isPageLikedByUser, setIsPageLikedByUser] = useState(false);

  let { user: { username: another_username, access_token } } = useContext(UserContext);
  let { setCommentsWrapper } = useContext(BlogPageContext);

  useEffect(() => {
    (async () => {
      let endpoint = endpoints['is-liked-by-user'];
      let promise = new ApiCaller(endpoint, methods.post, {
        blog_id: bmain_id,
      });

      let response = (await promise).data;
      setIsPageLikedByUser(response.liked_by_user);
    })();
  }, []);

  const navigte = useNavigate();

  const handleLike = async (e) => {
    e.preventDefault();

    if (access_token === null) {
      toast.error("You need to login to like this blog");
      return;
    }
    isPageLikedByUser ? total_likes <= 0 ? 0 : total_likes-- : total_likes++;
    setBlog({ ...blog, activity: { ...activity, total_likes } });

    let endpoint = endpoints["like-blog"];
    let promise = new ApiCaller(endpoint, methods.post, {
      blog_id,
      is_liked_by_user: isPageLikedByUser,
    });

    let response = (await promise).data;
    setIsPageLikedByUser(response.liked_by_user);
  }

  handleComment = (e) => {
    e.preventDefault();
    setCommentsWrapper(prev => !prev);
  }

  return (
    <>
      <Toaster />
      <hr className='border-grey my-2' />

      <div className="flex gap-6 justify-between">

        <div className='flex gap-3 items-center'>
          <div className="flex gap-3 items-center">
            <button className={`w-10 h-10 rounded-full flex items-center justify-center ${!isPageLikedByUser ? 'bg-grey/80' : 'bg-red/20 text-red'}`}
              onClick={handleLike}>
              <i className={`fi fi-${isPageLikedByUser ? 'sr' : 'rr'}-heart`}></i>
            </button>
            <p>{total_likes}</p>
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={handleComment} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
              <i className="fi fi-rr-comment-dots"></i>
            </button>
            <p>{total_comments}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {
            username == another_username
              ?
              <Link to={`/editor/${blog_id}`} className='underline hover:text-purple'>Edit</Link>
              :
              ""
          }

          <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>


      <hr className='border-grey my-2' />
    </>
  )
}

export default BlogInteraction