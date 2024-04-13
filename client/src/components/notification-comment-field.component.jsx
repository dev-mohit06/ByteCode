import React, { useContext, useState } from 'react'
import { Toaster,toast } from 'react-hot-toast';
import { handleComment } from './blog-interaction.component';
import { UserContext } from '../common/context';
import ApiCaller, { endpoints, methods } from '../common/api-caller';

const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined, setReplying, notification_id, notificationData }) => {

  let [comment, setComment] = useState('');

  let { _id: user_id } = blog_author;
  const { user: { access_token }, setUser } = useContext(UserContext);
  let { notifications, notifications: { results }, setNotifications } = notificationData;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.length) {
      toast.error("Comment should be atleast 5 characters long");
      return;
    }

    let loading = toast.loading("posting your comment...");
    let promise = new ApiCaller(endpoints['add-comment'], methods.post, {
      _id,
      comment,
      blog_author: user_id,
      replying_to: replyingTo,
      notification_id
    });

    let data = (await promise).data;
    toast.dismiss(loading);
    toast.success("Comment posted successfully");
    setComment('');
    setReplying(false);
    results[index].reply = {comment,_id: data._id};
    setNotifications({...notifications,results});
  }

  return (
    <>
      <Toaster />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Leave a reply...' className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'></textarea>
      <button className='btn-dark mt-5 px-10' onClick={handleComment}>Reply</button>
    </>
  )
}

export default NotificationCommentField