import React, { useContext, useState } from 'react'
import { formatDate } from '../common/date';
import { UserContext } from '../common/context';
import toast, { Toaster } from 'react-hot-toast';
import CommentField from './comment-field.component';

const CommentCard = ({ index, leftVal, commentData }) => {

  let { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment } = commentData;

  let { user: { access_token } } = useContext(UserContext);

  const [isReplying, setIsReplying] = useState(false);

  const handleClickReply = () => {
    if (access_token === null) {
      toast.error("You need to login to reply to this comment");
      return;
    }

    setIsReplying((prev) => !prev);
  }

  <Toaster />
  return (
    <div className='w-full' style={{
      paddingLeft: `${leftVal * 10}px`
    }}>
      <div className="my-5 p-6 border border-grey">
        <div className='flex gap-3 items-center mb-8'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clamp-1'>{fullname} @{username}</p>
          <p className='min-w-fit'>{formatDate(commentedAt)}</p>
        </div>

        <p className='font-gelasio text-xl ml-3'>{comment}</p>

        <div className='flex gap-5 item-center mt-5'>
          <button className='underline' onClick={handleClickReply}>Reply</button>
        </div>

        {
          isReplying
          ?
          <div className='mt-8'>
            <CommentField action={"reply"} index={index} replyingTo={commentData._id} setReplying={setIsReplying} />
          </div>
          :
          ""
        }
      </div>
    </div>
  )
}

export default CommentCard