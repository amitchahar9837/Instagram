import React from 'react'
import PostCardHeader from './PostCardHeader'
import PostCardFooter from './PostCardFooter'

export default function PostCard({post, followUser, deletePost, likePost, createComment}) {
  return (
    <div className='w-[90%] sm:max-w-lg dark:text-gray-100 rounded-md shadow-lg flex flex-col gap-4 p-4 border'>
      {/* Post Card Header */}
      <PostCardHeader post={post} followUser={followUser} deletePost={deletePost} />

      {/* Post Image */}
      <div className="w-full h-64 xxs:w-72 xxs:h-72 sm:w-96 sm:h-96 mx-auto">
        <img
          src={post && post.picture}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post footer */}
      <PostCardFooter post={post} followUser={followUser} likePost={likePost} createComment={createComment} />
    </div>
  )
}
