import React, { useContext } from 'react'
import { BlogPageContext } from '../pages/blog.page';
import { Link } from 'react-router-dom';
import {UserContext} from '../common/context'

const BlogInteraction = () => {

  let { blog: { title,blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username } } }, setBlog } = useContext(BlogPageContext);

  let {user:{username:another_username}} = useContext(UserContext);

  return (
    <>
      <hr className='border-grey my-2' />

      <div className="flex gap-6 justify-between">

        <div className='flex gap-3 items-center'>
          <div className="flex gap-3 items-center">
            <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
              <i className="fi fi-rr-heart"></i>
            </button>
            <p>{total_likes}</p>
          </div>

          <div className="flex gap-3 items-center">
            <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
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