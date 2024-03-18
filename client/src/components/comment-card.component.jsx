import React, { useContext, useState } from 'react'
import { formatDate } from '../common/date';
import { UserContext } from '../common/context';
import toast, { Toaster } from 'react-hot-toast';
import CommentField from './comment-field.component';
import { BlogPageContext } from '../pages/blog.page';
import ApiCaller, { endpoints, methods } from '../common/api-caller';

const CommentCard = ({ index, leftVal, commentData }) => {

  let { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment } = commentData;

  let { user: { access_token, username } } = useContext(UserContext);

  let { setTotalParentsCommentsLoaded, setBlog, blog, blog: { comments: { results: commentArr }, activity } } = useContext(BlogPageContext);

  const [isReplying, setIsReplying] = useState(false);

  const handleClickReply = () => {
    if (access_token === null) {
      toast.error("You need to login to reply to this comment");
      return;
    }

    setIsReplying((prev) => !prev);
  }

  const getParentIndex = () => {
    let startingPoint = index - 1;

    try {
      while (commentArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
        startingPoint--;
      }
    } catch (e) {
      startingPoint = undefined;
    }

    return startingPoint;
  }

  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentArr[startingPoint]) {
      while (commentArr[startingPoint].childrenLevel > commentData.childrenLevel) {
        commentArr.splice(startingPoint, 1);

        if (!commentArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();
      if (parentIndex != undefined) {
        commentArr[parentIndex].children = commentArr[parentIndex].children.filter((child) => child._id !== commentData._id)

        if (commentArr[parentIndex].children.length) {
          commentArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentArr.splice(index, 1);
    }

    if (commentData.childrenLevel == 0 && isDelete) {
      setTotalParentsCommentsLoaded((prev) => prev - 1);
    }

    setBlog({
      ...blog, comments: { results: commentArr }, activity: {
        ...activity, total_parent_comments: activity.total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)
      }
    });
  }

  const hideReplies = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCards(index + 1)
  }

  const loadReplies = async ({ skip = 0, currentIndex = index }) => {
    if (commentArr[currentIndex].children.length) {
      hideReplies();

      let promise = new ApiCaller(endpoints['fetch-replies'], methods.post, {
        skip,
        comment_id: commentArr[currentIndex]._id
      });

      let data = (await promise).data;

      commentArr[currentIndex].isReplyLoaded = true;
      for (let i = 0; i < data.children.length; i++) {
        data.children[i].childrenLevel = commentArr[currentIndex].childrenLevel + 1;

        commentArr.splice((currentIndex + 1 + i + skip), 0, data.children[i]);
      }

      setBlog({ ...blog, comments: { ...comment, results: commentArr } });
    }
  }

  const deleteComment = async (e) => {
    e.target.setAttribute('disabled', true);

    let loading = toast.loading("Deleting Comment");

    let endpoint = endpoints['delete-comment-or-reply'];
    let method = methods.post;

    let promise = new ApiCaller(endpoint, method, {
      comment_id: commentData._id
    });

    let data = await promise;
    toast.dismiss(loading);
    if (data.success) {
      toast.success("Comment Deleted");
      removeCommentsCards(index + 1, true);
      e.target.removeAttribute('disabled');
    }
  }

  const LoadMoreRepliesButton = () => {
    let parentIndex = getParentIndex();
    let btn = <button onClick={() => loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })} className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>Load More Replies</button>
    if (commentArr[index + 1]) {
      if (commentArr[index + 1].childrenLevel < commentArr[index].childrenLevel) {
        if ((index - parentIndex) < commentArr[parentIndex].children.length) {
          return btn;
        }
      }
    } else {
      if (parentIndex) {
        if ((index - parentIndex) < commentArr[parentIndex].children.length) {
          return btn;
        }
      }
    }

  }


  <Toaster />
  return (
    <div className='w-full' style={{
      paddingLeft: `${leftVal * 10}px`
    }}>
      <div className="my-5 p-6 border border-grey">
        <div className='flex gap-3 items-center mb-8'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clamp-1'>{fullname} @{commented_by_username}</p>
          <p className='min-w-fit'>{formatDate(commentedAt)}</p>
        </div>

        <p className='font-gelasio text-xl ml-3'>{comment}</p>

        <div className='flex gap-5 item-center mt-5'>
          {
            commentData.isReplyLoaded ?
              <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={hideReplies}>
                <i className="fi fi-rs-comment-dots"></i>
                Hide Reply
              </button>
              :
              <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={loadReplies}>
                <i className="fi fi-rs-comment-dots"></i>
                {commentData.children.length} Reply
              </button>
          }
          <button className='underline' onClick={handleClickReply}>Reply</button>
          {
            username === commented_by_username
              ?
              <button className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center' onClick={deleteComment}>
                <i className="fi fi-rr-trash pointer-events-none"></i>
              </button>
              :
              ""
          }
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

      <LoadMoreRepliesButton />

    </div>
  )
}

export default CommentCard