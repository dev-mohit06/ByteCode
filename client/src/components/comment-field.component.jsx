import React, { useContext, useState } from 'react'
import { UserContext } from '../common/context';
import toast, { Toaster } from 'react-hot-toast';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { BlogPageContext } from '../pages/blog.page';


export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    let res;

    let promise = new ApiCaller(endpoints['fetch-comment'], methods.post, {
        skip,
        blog_id,
    });

    let data = (await promise).data;
    data.map(comment => {
        comment.childrenLevel = 0;
    });

    setParentCommentCountFun((prev) => prev + data.length);

    if (comment_array === null) {
        res = {
            results: data,
        }
    } else {
        res = {
            results: [...comment_array.results, ...data],
        }
    }

    return res;
}

const CommentField = ({ action,index = undefined, replyingTo = undefined, setReplying }) => {

    const [comment, setComment] = useState("");

    let { user: { access_token, username, fullname, profile_img } } = useContext(UserContext);
    let { blog, blog: { _id: bmain_id, blog_id, author: { _id: blog_author }, comments, comments: { results: commentArr } }, setBlog, setTotalParentsCommentsLoaded } = useContext(BlogPageContext);


    const handleCommentChange = (e) => {
        setComment(e.target.value);
    }

    const handleCommnet = async (e) => {
        e.preventDefault();
        if (access_token === null) {
            toast.error("You need to login to comment on this blog");
            return;
        }


        if (!comment.length) {
            toast.error("Comment should be atleast 5 characters long");
            return;
        }


        let loading = toast.loading("posting your comment...");
        let promise = new ApiCaller(endpoints['add-comment'], methods.post, {
            _id: bmain_id,
            comment,
            blog_author,
            replying_to: replyingTo,
            is_reply: replyingTo ? true : false,
        });

        let data = (await promise).data;
        toast.dismiss(loading);
        toast.success("Comment posted successfully");

        setComment("");

        data.commented_by = {
            personal_info: {
                username,
                profile_img,
                fullname,
            }
        }

        let newCommnetArr;

        if(replyingTo){
            commentArr[index].children.push(data._id);

            data.childrenLevel = commentArr[index].childrenLevel + 1;
            data.parentIndex = index;

            commentArr[index].isReplyLoaded = true;
            commentArr.splice(index + 1, 0, data)
            newCommnetArr = commentArr;
            setReplying(prev => !prev);
        }else{
            data.childrenLevel = 0;
            newCommnetArr = [data, ...commentArr];
        }

        let parentCommentIncrementalValue = replyingTo ? 0 : 1;
        
        setBlog({
            ...blog,
            comments: {
                ...comments,
                results: newCommnetArr
            },
            activity: {
                ...blog.activity,
                total_comments: blog.activity.total_comments + 1,
                total_parent_comments: blog.activity.total_parent_comments + parentCommentIncrementalValue,
            },
        })
        setTotalParentsCommentsLoaded(prev => prev + parentCommentIncrementalValue)
    }

    return (
        <>
            <Toaster />
            <textarea value={comment} onChange={handleCommentChange} placeholder='Leave a commnet...' className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'></textarea>
            <button onClick={handleCommnet} className='btn-dark mt-5 px-10'>{action}</button>
        </>
    )
}

export default CommentField