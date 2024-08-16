import React from "react";
import { Link } from "react-router-dom";
import Comment from "./Comment";

export default function PostDetailCommentSection({
  post,
  comments,
  onDelete,
  onEdit,
}) {
  return (
    <div className="w-full border-y h-[300px]  lg:h-[60%] overflow-y-auto noScrollbar border-slate-100 p-2 py-4">
      {post.title === "" && comments.length <= 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="font-semibold text-xl lg:text-3xl">
            No comments yet.
          </h1>
          <p className="text-gray-400">Start the conversation</p>
        </div>
      ) : (
        <>
          {post.title !== "" && (
            <div className="w-full flex items-center gap-2 mb-1">
              <Link to={`/user/${post.postedBy._id}`}>
                <img
                  src={post.postedBy.dp}
                  alt={post.postedBy.name}
                  className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
                />
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  to={`/user/${post.postedBy._id}`}
                  className="font-semibold"
                >
                  {post.postedBy.name}
                </Link>
                <p className="text-gray-500">{post.title}</p>
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
