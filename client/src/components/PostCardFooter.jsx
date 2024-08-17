import React, { useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { LuSendHorizonal } from "react-icons/lu";
import LikeList from "./LikeList";
import { Link } from "react-router-dom";
export default function PostCardFooter({ post, followUser, likePost, createComment }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const handleCreateComment = async (e) => {
      e.preventDefault();
      createComment(post._id, comment);
      setComment("");
  };
  const [showLikes,setShowLikes] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* Like Comment Icons */}
      <div className="flex gap-4 items-center text-2xl px-2">
        {post.likes.includes(currentUser._id) ? (
          <MdFavorite
            style={{
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => likePost(post._id)}
          />
        ) : (
          <MdFavoriteBorder
            style={{ cursor: "pointer" }}
            onClick={() => {
              likePost(post._id);
            }}
          />
        )}
        <Link to={`/post/${post._id}`}> <FaRegComment className=" font-semibold text-xl hover:font-bold hover:scale-105 cursor-pointer" /></Link>
      </div>
      {/* No. of Likes */}
      <div className="text-sm px-2">
        {post.likes.length > 0 && (
          <span
            className="font-medium cursor-pointer inline"
            onClick={() =>setShowLikes(true)}
          >
            {post.likes.length > 1
              ? `${post.likes.length} likes`
              : `${post.likes.length} like`}
          </span>
        )}
        {post.comments.length > 0 && (
          <div className="mt-1">
            <Link to={`/post/${post._id}`}
              className="font-semibold inline cursor-pointer"
            >{`view all ${
              post.comments.length === 1
                ? `${post.comments.length} comment`
                : `${post.comments.length} comments`
            }`}</Link>
          </div>
        )}
      </div>
      {/* post caption */}
      <div className="px-2 -mt-2">
        <h2 className="text-gray-600 dark:text-gray-300">{post.caption}</h2>
      </div>

      {/* Create comment form */}
      <form
        onSubmit={handleCreateComment}
        className="w-full -mt-2 flex justify-between items-center border-b-2 border-slate-300 "
      >
        <textarea
          className="resize-none w-full noScrollbar border-none outline-none focus:ring-0 focus:border-none bg-transparent placeholder:text-gray-400 text-md "
           placeholder="Add a comment"
          rows={"1"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {comment.length > 0 && (
                  <button type="submit" className="pr-4">
                    <LuSendHorizonal className="text-xl text-blue-500" />
                  </button>
                )}
      </form>

      {/* LikeList Popup */}
      {
        showLikes && (
          <LikeList followUser={followUser} post={post} setShowLikes={setShowLikes} />
        )
      }
    </div>
  );
}
