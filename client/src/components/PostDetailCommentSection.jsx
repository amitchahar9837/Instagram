import React from "react";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useSelector } from "react-redux";

export default function PostDetailCommentSection({
  post,
  comments,
  onDelete,
  onEdit,
}) {

  const {currentUser} = useSelector((state)=>state.user);
  return (
    <div className="w-full border-y h-[300px]  lg:h-[60%] overflow-y-auto noScrollbar border-slate-100 p-2 py-4">
      {!post.caption && comments.length <=0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="font-semibold text-xl lg:text-3xl">
            No comments yet.
          </h1>
          <p className="text-gray-400">Start the conversation</p>
        </div>
      ) : (
        <>
          {post.caption && (
            <div className="w-full flex items-start gap-2 mb-1">
              <Link to={`${currentUser._id === post.postedBy._id ? "/profile" : `/user/${post.postedBy._id}`}`}>
                <img
                  src={post.postedBy.dp}
                  alt={post.postedBy.name}
                  className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
                />
              </Link>
              <div className="flex items-center gap-1 flex-wrap dark:text-white flex-1">
                <span className="text-gray-500"><Link className="font-bold text-gray-600 dark:text-gray-200" to={`${currentUser._id === post.postedBy._id ? "/profile" : `/user/${post.postedBy._id}`}`} >{post.postedBy.name}</Link> {post.caption} </span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 mt-2">
            {comments.map((comment, index) => (
              <Comment
                key={comment._id + index}
                comment={comment}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
