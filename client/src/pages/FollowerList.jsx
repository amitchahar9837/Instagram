import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { Spinner } from "flowbite-react";

export default function FollowerList() {
      const [followerList, setFollowerList] = useState([]);
      const [list,setList] = useState([]);
      const [loading,setLoading] = useState(false);
      const {currentUser} = useSelector((state) => state.user);
      const {userId} = useParams();
      const dispatch = useDispatch();
      
      const fetchList = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/user/followerlist/${userId}`);
          const data = await res.json();
          if (res.ok) {
            setFollowerList(data);
            setList(data);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log(error.message);
        }
      };

      const handleSearch = async(e) =>{
        const searchText = e.target.value;
        if(searchText !== ''){
          setList(followerList.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()) || user.username.toLowerCase().includes(searchText.toLowerCase())))
        }
      }

      useEffect(()=>{
        fetchList();
      },[userId])

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

      const handleRemove = (removedUser) =>{
        setFollowerList(followerList.filter(user => user._id !== removedUser._id));
        setList(followerList.filter(user => user._id !== removedUser._id));
      }
      const removeUser = async(userId) =>{
        console.log(userId, ":userId");
        try {
          dispatch(updateStart())
          const res = await fetch(`/api/user/removefollower/${userId}`,{
            method:'PUT'
          })
          if(res.ok){
            const data = await res.json();
            dispatch(updateSuccess(data.currentUser));
            handleRemove(data.followedUser);     
          }else{
            dispatch(updateFailure());
          }
        } catch (error) {
          console.log(error.message);
            dispatch(updateFailure());
        }
      }

  return (
    <div className='my-4'>
      <div className='w-full max-w-2xl mx-auto flex flex-col gap-5'>
            <h2 className='font-bold text-lg text-center'>Followers</h2>
            

            <div className="flex flex-col gap-6 ">
            {
              loading ? (
                <h3 className="text-center text-3xl">
                <Spinner size={"lg"} />
              </h3>
              ) : (
                !loading && list.length > 0 ? (
                  <>
                  <input type="text" placeholder='Search' className='w-full border-none outline-none focus:ring-0 focus:border-none bg-[#efefef] placeholder:text-gray-400 text-sm rounded' onChange={handleSearch} />
                    {
                      list.map((user) => (
                        <div className='flex justify-between items-center' key={user._id}>
                          <div className="flex gap-2 items-center ">
                          <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className="w-8 h-8">
                            <img src={user.dp} alt={user.name} className='w-full h-full rounded-full' />
                          </Link>
                          <div className='flex gap-2'>
                          <div className='flex flex-col'>
                          <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className='font-medium'>{user.username}</Link>
                          <p className='text-gray-500'>{user.name}</p>
                          </div>
                          {
                            currentUser._id === userId ? (
                              !currentUser.following.includes(user._id) && (
                                <p className='text-blue-500 cursor-pointer font-semibold' onClick={()=>followUser(user._id)}>follow</p>                            
                              )
                            ) : ('')
                          }
                          </div>
                          </div>
                          {
                            userId === currentUser._id ? (
                              <button className='text-black bg-slate-100 px-2 py-1 rounded' onClick={()=>removeUser(user._id)} >Remove</button>
                            ) : (
                              user._id !== currentUser._id && (
                                !currentUser.following.includes(user._id) ? (
                              <button className='text-white bg-blue-500 px-2 py-1 rounded' onClick={()=>followUser(user._id)} >Follow</button>                              
                                ) : (
                              <button className='text-black bg-slate-100 px-2 py-1 rounded' onClick={()=>followUser(user._id)} >Following</button>
                                )
                              ) 
                            )
                          }
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                  <h1 className="font-semibold text-xl lg:text-3xl">
                    Followers
                  </h1>
                  <p className="text-gray-400">You'll see all the people who follow you here.</p>
                </div>
                )
              ) 
            }
            </div>
      </div>
    </div>
  )
}
