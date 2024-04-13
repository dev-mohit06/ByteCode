import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { formatDate } from '../common/date';
import NotificationCommentField from './notification-comment-field.component';
import { UserContext } from '../common/context';
import ApiCaller, { endpoints, methods } from '../common/api-caller';

const NotificationCard = ({ data, index, notificationState, notificationState:{notifications,setNotifications} }) => {

  const [isReplying, setReplying] = useState(false);

  let { seen,type, reply, createdAt, comment, user, replied_on_comment, user: { personal_info: { profile_img, fullname, username } }, blog: { _id, blog_id, title }, _id: notification_id } = data;

  let {notifications: {results}} = notificationState;

  const { user: { access_token, username: another_username, profile_img: author_profile_img }, setUser } = useContext(UserContext);

  const handleClickReply = () => {
    setReplying(prev => !prev);
  }  
  const handleDelete = async (comment_id,type,target) => {
    target.disabled = true;

    let promise = new ApiCaller(endpoints['delete-comment-or-reply'],methods.post,{
      comment_id,
    });

    let data = (await promise).data;
    if(type == "comment"){
      results.splice(index,1);
    }else{
      delete results[index].reply;
    }
    
    target.removeAttribute('disabled');
    let perviousDocsCount = notifications.totalDocs.notification_count;
    setNotifications({...notifications,results,totalDocs: { totalDocs: perviousDocsCount - 1}})
  }

  return (
    <div className={`p-6 border-b border-grey border-l-black ${seen ? "" : "border-l-2"}`}>
      <div className='flex gap-5 mb-3'>
        <img src={profile_img} alt={fullname} className='w-14 h-14 flex-none rounded-full' />
        <div className='w-full'>
          <h1 className='font-medium text-xl text-dark-grey'>
            <span className='lg:inline-block hidden capitalize'>
              {fullname}
            </span>
            <Link to={`/user/${username}`} className='mx-1 text-black underline'>@{username}</Link>
            <span className='font-normal'>
              {
                type == 'like' ? "liked your post" :
                  type == 'comment' ? "commented on your post" :
                    type == 'reply' ? "replied to your comment" : ''
              }
            </span>
          </h1>

          {
            type == 'reply'
              ?
              <div className='p-4 mt-4 rounded-md bg-grey'>
                <p>{replied_on_comment.comment}</p>
              </div>
              :
              <Link to={`/blog/${blog_id}`} className='font-medium text-dark-grey hover:underline line-clamp-1'>{`"${title}"`}</Link>
          }

        </div>
      </div>

      {
        type != 'like'
          ?
          <p className='ml-14 pl-5 font-gelasio text-xl my-5'>{comment.comment}</p>
          :
          ""
      }

      <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
        <p>{formatDate(createdAt)}</p>

        {
          type != 'like'
            ?
            <>
              {
                reply ? "" : <button onClick={handleClickReply} className='underline hover:text-black'>Reply</button>
              }
              <button onClick={(e) => handleDelete(comment._id,"comment",e.target)} className='underline hover:text-black'>Delete</button>
            </>
            :
            ""
        }

      </div>
      {
        isReplying
          ?
          <div className='mt-8'>
            <NotificationCommentField _id={_id} blog_author={user} index={index} replyingTo={comment._id} setReplying={setReplying} notification_id={notification_id} notificationData={notificationState} />
          </div>
          :
          ""
      }

      {
        reply
          ?
            <div className='ml-20 p-5 bg-grey mt-5 rounded-lg'>
              <div className='flex gap-3 mb-3'>
                <img src={author_profile_img} className='w-8 h-8 rounded-full' />
                <h1 className='font-medium text-xl text-dark-grey'>
                  <Link className='mx-1 text-black underline' to={`/user/${another_username}`}>@{another_username}</Link>

                  <span className='font-normal'>replied on</span>

                  <Link to={`/user/${another_username}`} className='mx-1 text-black underline'>@{username}</Link>
                </h1>
              </div>
            <p className='ml-14 font-gelasio text-xl my-2'>{reply.comment}</p>

            <button onClick={(e) => handleDelete(comment._id,"reply",e.target)} className='ml-14 underline hover:text-black'>Delete</button>
            </div>
          :
          ""
      }
    </div>
  )
}

export default NotificationCard