import React, { useContext } from 'react'
import { BlogPageContext } from '../pages/blog.page'
import { handleComment } from './blog-interaction.component';
import CommentField, { fetchComments } from './comment-field.component';
import CommentCard from './comment-card.component';
import AnimationWrapper from '../common/page-animation';

const CommnetsContainer = () => {
    let { commentsWrapper, setCommentsWrapper } = useContext(BlogPageContext)
    let { blog,setBlog,blog: { _id, title, comments: { results: commentArr }, activity: {
        total_parent_comments,
    } }, totalParentsCommentsLoaded, setTotalParentsCommentsLoaded } = useContext(BlogPageContext);

    const handleLoadMoreComments = async () => {
        let newCommnetArr = await fetchComments({
            skip: totalParentsCommentsLoaded,
            blog_id: _id,
            setParentCommentCountFun: setTotalParentsCommentsLoaded,
            comment_array: {results : commentArr}
        });
        setBlog({ ...blog, comments: newCommnetArr });
    }
    return (
        <div className={`max-sm:w-full fixed ${commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden `}>
            <div className="relative">
                <h1 className="text-xl font-medium">Commnets</h1>
                <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>{title}</p>

                <button onClick={handleComment} className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey text-2xl mt-1'>
                    <i className="fi fi-br-cross"></i>
                </button>
            </div>

            <hr className='border-grey my-8 w-[120%] -ml-10' />

            <CommentField action={"comment"} />

            {
                commentArr && commentArr.length ?
                    commentArr.map((comment, index) => {
                        return (
                            <AnimationWrapper key={index}>
                                <CommentCard index={index} leftVal={comment.childrenLevel * 4} commentData={comment} />
                            </AnimationWrapper>
                        )
                    }) : <p className="text-dark-grey">No comments yet</p>
            }

            {
                total_parent_comments > totalParentsCommentsLoaded
                    ?
                    <button
                        onClick={handleLoadMoreComments}
                        className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                        Load More
                    </button>
                    :
                    ""
            }
        </div>
    )
}

export default CommnetsContainer