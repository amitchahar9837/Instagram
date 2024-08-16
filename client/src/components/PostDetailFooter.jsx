import React, { useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { LuSendHorizonal } from "react-icons/lu";
import LikeList from "./LikeList";
import moment from 'moment'

export default function PostDetailFooter({ post, followUser, likePost, createComment }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const handleCreateComment = async (e) => {
      e.preventDefault();
      createComment(post._id, comment);
      setComment("");
  };
  const [showLikes,setShowLikes] = useState(false);

  return (
    <div className="flex flex-col gap-2 py-2">
      {/* Lik Comment Icons */}
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
        <FaRegComment className=" font-semibold text-xl hover:font-bold hover:scale-105 cursor-pointer" />
      </div>
      {/* No. of Likes */}
      <div className="text-sm px-2">
        {post.likes.length > 0 ? (
          <span
            className="font-medium cursor-pointer inline"
            onClick={() =>setShowLikes(true)}
          >
            {post.likes.length > 1
              ? `${post.likes.length} likes`
              : `${post.likes.length} like`}
          </span>
        ) : (
            <span className="text-gray-400">Be the first to <span className="font-semibold cursor-pointer" onClick={()=>likePost(post._id)}>Like this</span></span>
        )}
      </div>
      <span className="text-gray-500 text-sm px-2">{moment(post.createdAt).fromNow()}</span>
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
