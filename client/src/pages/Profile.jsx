import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaRegHeart, FaRegComment } from "react-icons/fa";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const loadingPost = new Array(6).fill(null);
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/post/myposts");
    const data = await res.json();
    if (res.ok) {
      setPosts(data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [location]);
  return (
    <div className="w-full max-w-[90%] mx-auto min-h-[calc(100vh-70px)] flex flex-col gap-4 p-4">
      {loading && (
        <>
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center w-full max-w-2xl mx-auto py-4">
            <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-full"></div>
            <div className="flex flex-col gap-1">
              <div className="w-72 h-10 bg-slate-200 animate-pulse rounded-sm"></div>
              <div className="w-72 h-10 bg-slate-200 animate-pulse rounded-sm"></div>
              <div className="w-72 h-10 bg-slate-200 animate-pulse rounded-sm"></div>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-200"></div>
          <div className=""></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4 ">
            {loadingPost.map((post, index) => (
              <div
                key={index}
                className="w-full h-72 bg-slate-100 animate-pulse rounded-sm"
              ></div>
            ))}
          </div>
        </>
      )}
      <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center w-full max-w-2xl mx-auto py-4 dark:text-slate-100">
        <div className="w-36 h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
          <img
            src={currentUser.dp}
            alt="user"
            className={`w-full h-full object-cover bg-white rounded-full`}
          />
        </div>
        <div className="flex flex-col gap-2 items-center md:items-start">
          <h1 className="text-3xl font-bold">{currentUser.name}</h1>
          <p className="font-medium">{currentUser.email}</p>
          <div className="flex items-center gap-2 sm:gap-4 text-lg font-semibold">
            <h2>{posts && posts.length} posts</h2>
            <Link to={`/profile/follower-list/${currentUser._id}`}>{currentUser && currentUser.followers.length} followers</Link>
            <Link to={`/profile/following-list/${currentUser._id}`}>{currentUser && currentUser.following.length} following</Link>
          </div>
          <Link to={`/profile/edit/${currentUser._id}`} className="w-full py-2 block text-center font-medium bg-slate-100 text-black rounded-sm">Edit Profile</Link>
        </div>
      </div>
        <div className="w-full h-1 bg-gray-200"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-4 ">
          {posts && posts.map((post) => (
            <div
              key={post._id}
              className="w-full sm:w-80 h-80 bg-slate-800 rounded-sm relative group"
            >
              <img
                src={post.picture}
                alt="post"
                className="w-full h-full object-cover rounded-sm group-hover:opacity-40"
              />
              <div className="hidden group-hover:flex items-center justify-center gap-4 absolute top-0 left-0 bottom-0 right-0 text-white text-xl cursor-pointer">
                  <div className="flex flex-col items-center">
                  <FaRegHeart />
                  {post.likes.length}
                  </div>
                  <div className="flex flex-col items-center">
                  <FaRegComment />
                  {post.comments.length}
                  </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
