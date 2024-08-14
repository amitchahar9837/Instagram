import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

export default function LikeList({user, followUser}) {
      const {currentUser} = useSelector((state) => state.user);
  return (
      <div
      className="flex justify-between items-center w-full"
    >
      <div className="flex gap-2 sm:gap-4 items-center">
        <Link
          to={`${
            currentUser._id === user._id
              ? "/profile"
              : `/user/${user._id}`
          }`}
          className="w-8 h-8 rounded-full"
        >
          <img
            src={user.dp}
            alt={user.name}
            className="w-full h-full rounded-full"
          />
        </Link>
        <div className="">
          <Link
            to={`${
              currentUser._id === user._id
                ? "/profile"
                : `/user/${user._id}`
            }`}
            className="font-medium line-clamp-1 text-sm sm:text-md inline-block w-80% text-nowrap text-ellipsis"
          >
            {user.email}
          </Link>
          <h4 className="font-normal text-sm sm:text-md line-clamp-1">
            {user.name}
          </h4>
        </div>
      </div>

      {currentUser._id !== user._id ? (
        currentUser.following.includes(user._id) ? (
          <button
            className="bg-slate-100 text-black text-sm font-medium py-1 px-2 rounded"
            onClick={() => followUser(user._id)}
          >
            Following
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white text-sm font-medium py-1 px-2 rounded"
            onClick={() => followUser(user._id)}
          >
            Follow
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  )
}
