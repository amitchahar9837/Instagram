import React, { useEffect, useState } from 'react'
import LoadingPost from '../components/LoadingPost';
import {Link} from 'react-router-dom'
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import {updateStart, updateSuccess, updateFailure} from '../redux/user/userSlice'

export default function Home() {
  const loadingPost = new Array(9).fill(null);
  const [loading,setLoading] = useState(false);
  const [posts,setPosts] = useState([]);
  const [errorMessage,setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user)

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
  //fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/post/followingUser-post");
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
        setLoading(false);
        setErrorMessage(null);
      }else{
        setLoading(false);
        setErrorMessage(data.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  }


  //follow user
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

  //delete post 
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

  useEffect(()=>{
   currentUser.following.length >0 ? fetchPosts() : setErrorMessage("You are not following anyone please follow to see their posts");
  },[])

  return (
    <div className='min-h-[calc(100vh-70px)] my-8'>
      <div className="flex flex-col gap-14 pb-4 items-center">
          {
            loading ? (
              loadingPost.map((_, index) => (
                <LoadingPost key={"loading " + index + "_"} />
              ))
            ) : (
              errorMessage ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <h1 className="font-semibold text-xl lg:text-3xl">{errorMessage}</h1>
                </div>
              ) : (
                posts.length > 0 ? (
                  posts.map((post,index) => (
                    <PostCard 
                      key={post._id + index} 
                      post={post}
                      followUser={followUser}
                      deletePost={deletePost}
                      likePost={likePost}
                      createComment ={createComment}
                    />
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                  <h1 className="font-semibold text-xl lg:text-3xl">
                    No post yet!.
                  </h1>
                  <p className="text-gray-400"></p>
                </div>
                )
              )
            )
          }
      </div>  
    </div>
  )
}
