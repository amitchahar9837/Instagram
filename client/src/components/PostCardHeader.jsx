import React from "react";
import DropdownComp from "./DropdownComp";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

export default function PostCardHeader({ post, followUser, deletePost }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <Link
          to={`${
            currentUser._id === post.postedBy._id
              ? "/profile"
              : `/user/${post.postedBy._id}`
          }`}
        >
          <img
            src={post && post.postedBy && post.postedBy.dp}
            alt="user"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
        </Link>
        <div className="flex gap-1 items-center text-sm">
          <Link
            to={`${
              currentUser._id === post.postedBy._id
                ? "/profile"
                : `/user/${post.postedBy._id}`
            }`}
            className="font-semibold text-md"
          >
            {post && post.postedBy && post.postedBy.name}
          </Link>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400">
            {moment(post.createdAt).fromNow()}
          </span>
          {currentUser._id !== post.postedBy._id &&
            !currentUser.following.includes(post.postedBy._id) && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-blue-500 font-medium cursor-pointer" onClick={()=>followUser(post.postedBy._id)}>
                  follow
                </span>
              </>
            )}
        </div>
      </div>
      <DropdownComp post={post} followUser={followUser} deletePost={deletePost} />
    </div>
  );
}
