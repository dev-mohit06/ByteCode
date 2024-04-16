import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { formatDate } from '../common/date';
import {UserContext} from '../common/context';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import toast from 'react-hot-toast';


const BlogStats = ({stats}) => {
  return (
    <>
      <div className="flex gap-2 mb-6 pb-6 border-grey border-b">
        {
          Object.keys(stats).map((info, i) => (
            !info.includes("parent")
            ?
            <div key={i} className={`flex md:flex-col items-center w-full h-full justify-center p-4 px-6 ${ i != 0 ? "border-grey border-l" : "" } `}>
              <h1 className="text-xl lg:text-2xl mb-2">{stats[info].toLocaleString()}</h1>
              <p>{info.split("_")[1]}</p>
            </div>
            :
            ""
          ))
        }
      </div>
    </>
  );
}

export const ManagePublishedBlogCard = ({blog}) => {
  let {banner,blog_id,title,publishedAt,activity,index} = blog;

  index++;
  
  let [showStat,setShowStat] = useState(false);
  return (
    <>
      <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
        <img src={banner} className='max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover'/>

        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
          <div>
            <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline'>{title}</Link>
            <p className='line-clamp-1'>Published on {formatDate(publishedAt)}</p>
          </div>

          <div className='flex gap-6 mt-3'>
            <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline'>Edit</Link>
            <button onClick={() => setShowStat(prev => !prev)} className='lg:hidden pr-4 py-2 underline'>Stats</button>
            <button onClick={(e) => deleteBlog(blog,e.target)} className='text-red pr-4 py-2 underline'>Delete</button>
          </div>
        </div>

        <div className='max-lg:hidden'>
          <BlogStats stats={activity}/>
        </div>
      </div>

      {
        showStat
        ?
        <div className='lg:hidden'>
          <BlogStats stats={activity} />
        </div>
        :
        ""
      }

    </>
  )
}

export const ManageDraftBlogPost = ({blog}) => {

  let {banner,blog_id,title,publishedAt,activity,des,index} = blog;

  index++;

  return (
    <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
      <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? "0" + index : index}</h1>

      <div>
        <h1 className='blog-title mb-3'>{title}</h1>
        <p className='line-clamp-2 font-gelasio'>{des.length ? des : "No Description"}</p>

        <div className='flex gap-6 mt-3'>
          <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline'>Edit</Link>
          <button onClick={(e) => deleteBlog(blog,e.target)} className='text-red pr-4 py-2 underline'>Delete</button>
        </div>
      </div>
    </div>
  )
}


const deleteBlog = async (blog,target) => {
  let {index,blog_id,setStateFunction} = blog;

  target.setAttribute("disabled",true);
  
  let promise = new ApiCaller(endpoints['delete-blog'],methods['post'],{
    blog_id
  });
  let loading = toast.loading("Deleting Blog...");
  let data = await promise;
  toast.dismiss(loading);
  if(data.success){
    toast.success(data.message);
    target.setAttribute("disabled",false);
    setStateFunction(prev => {
      let {deleteDocCount,totalDocs,results} = prev;

      if(!deleteDocCount){
        deleteDocCount = 0;
      }

      results.splice(index,1);

      if(!results.length && totalDocs - 1 > 0){
        return null;
      }

      return {...prev,totalDocs: totalDocs - 1,deleteDocCount: deleteDocCount + 1};
    });
  }else{
    toast.error(data.message);
    target.setAttribute("disabled",false);
  }
}