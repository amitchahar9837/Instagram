import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom'
import Post from '../components/Post';
import { useDispatch } from 'react-redux';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
export default function Home() {
  const [loading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  const loadingPost = new Array(9).fill(null);
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  
  const likePost = async (postId)=>{
    try {
      const res = await fetch(`/api/post/likepost/${postId}`, {
        method:'PUT',
      })
      if(res.ok){
        const data = await res.json();
        const newData = posts.map((post) => {
          if (post._id === data._id) {
            return data;
          } else {
            return post;
          }
        });
        setPosts(newData);
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const createComment = async (postId, comment)=>{
    if(comment === '') return;
    try {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({text:comment})
      })
      if(res.ok){
        const data = await res.json();
        const newData = posts.map((post) => {
          if (post._id === data._id) {
            return data;
          } else {
            return post;
          }
        });
        setPosts(newData);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/delete-post/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        const newData = posts.filter((post) => {
          return post._id !== postId;
        });
        setPosts(newData);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const followUser = async (userId) =>{
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/follow/${userId}`,{
        method:'PUT'
      })
      if(res.ok){
        const data = await res.json();
        dispatch(updateSuccess(data.currentUser));      
      }else{
        dispatch(updateFailure());
      }
    } catch (error) {
        console.log(error.message);
        dispatch(updateFailure());
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
        setLoading(false);
      }else{
        setLoading(false);
        setErrorMessage(data.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  }
  useEffect(()=>{
    fetchPosts();
  },[location])

  return (
    <div className='min-h-[calc(100vh-70px)] my-8'>
      <div className="flex flex-col gap-14 items-center">
        {loading ? (
          <>
            {loadingPost.map((_, index) => (
          <div
            key={index}
            className="w-full max-w-xl h-[calc(100vh-100px)] rounded-md shadow-lg flex flex-col gap-4 p-4"
          >
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse"></div>
              <div className="h-10 w-32 rounded bg-slate-100 animate-pulse"></div>
            </div>
            <div className='w-full flex-1 bg-slate-100 animate-pulse'></div>
          </div>
        ))}
          </>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => <Post key={post._id} post={post} likePost={likePost} createComment={createComment} deletePost={deletePost} followUser={followUser} />)
            ) : (
              <h1 className='text-xl font-medium'>No Post Uploaded Yet!</h1>
            )}
          </>
        )}
      </div>
    </div>
  )
}
