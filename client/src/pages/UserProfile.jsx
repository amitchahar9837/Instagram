import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import {updateFailure, updateStart, updateSuccess} from '../redux/user/userSlice';
import {Spinner} from 'flowbite-react'
export default function Profile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const loadingPost = new Array(6).fill(null);
  const { currentUser,loading:followLoading } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getuser/${id}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setUser(data.user);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //follow user
  const followUser = async (userId) =>{
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/follow/${userId}`,{
        method:'PUT'
      })
      if(res.ok){
        const data = await res.json();
        setUser(data.followedUser);    
        dispatch(updateSuccess(data.currentUser));  
      }else{
        dispatch(updateFailure());
      }
    } catch (error) {
        console.log(error.message);
        dispatch(updateFailure());
    }
  }
  useEffect(() => {
    fetchUser();
  }, [location]);
  return (
    <div className="w-full max-w-[90%] mx-auto min-h-[calc(100vh-70px)] flex flex-col gap-4 p-4">
      {loading ? (
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
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center w-full max-w-2xl mx-auto py-4 dark:text-slate-100">
            <div className="w-36 h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
              <img
                src={user.dp}
                alt="user"
                className={`w-full h-full object-cover bg-white rounded-full`}
              />
            </div>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-2 sm:gap-4 text-lg font-semibold">
                <h2>{posts && posts.length} posts</h2>
                <Link to={`/profile/follower-list/${user._id}`}>{user && user.followers.length} followers</Link>
                <Link to={`/profile/following-list/${user._id}`}>{user && user.following.length} following</Link>
              </div>
              {currentUser.following.includes(user._id) ? (
                <button className="w-full py-2 bg-slate-100 text-green-500 rounded-sm" onClick={() => followUser(user._id)} disabled={followLoading} >
                  {
                    followLoading ? <Spinner /> : 'Following'
                  }
                </button>
              ) : (
                <button className="w-full py-2 bg-blue-500 text-white rounded-sm" onClick={() => followUser(user._id)}>
                  {
                    followLoading ? <Spinner /> : 'Follow'
                  }
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-gray-200"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-4">
            {posts &&
              posts.map((post) => (
                <Link
                  to={`/post/${post._id}`}
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
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
