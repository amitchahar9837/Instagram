import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DropdownComp from './DropdownComp'

export default function PostDetailHeader({post, followUser, deletePost}) {
      const {currentUser} = useSelector((state) => state.user)
  return (
      <div className="flex justify-between items-center w-full px-2 pb-4">
      <div className="flex items-center gap-2">
        <Link to={`${currentUser._id === post.postedBy._id ? "/profile" : `/user/${post.postedBy._id}`}`}>
          <img
            src={post.postedBy.dp}
            alt=""
            className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
          />
        </Link>
        <div className="flex gap-1 items-center dark:text-white">
          <Link
            to={`${currentUser._id === post.postedBy._id ? "/profile" : `/user/${post.postedBy._id}`}`}
            className="font-medium"
          >
            {post.postedBy.name}
          </Link>
          {currentUser._id !== post.postedBy._id &&
            !currentUser.following.includes(post.postedBy._id) && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-blue-500 font-semibold cursor-pointer text-sm">
                  follow
                </span>
              </>
            )}
        </div>
      </div>
      <DropdownComp
        post={post}
        deletePost={deletePost}
        followUser={followUser}
      />
    </div>
  )
}
