import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { Spinner } from "flowbite-react";

export default function FollowingList() {
      const [followingList, setFollowingList] = useState([]);
      const [loading,setLoading] = useState(false);
      const {currentUser} = useSelector((state) => state.user);
      const [list,setList] = useState([]);
      const {userId} = useParams();
      const dispatch = useDispatch();

      const fetchList = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/user/followinglist/${userId}`);
          const data = await res.json();
          if (res.ok) {
            setFollowingList(data);
            setList(data);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log(error.message);
        }
      };

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

      const handleSearch = async(e) =>{
        const searchText = e.target.value;
        if(searchText === '')setList(followingList);
        if(searchText !== ''){
          setList(followingList.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()) || user.username.toLowerCase().includes(searchText.toLowerCase())))
        }
      }

      useEffect(()=>{
        fetchList();
      },[userId])
  return (
    <div className='my-4'>
      <div className='w-full max-w-2xl mx-auto flex flex-col gap-5 px-4 py-2'>
            <h2 className='font-medium text-lg text-center'>Following</h2>
            <div className="flex flex-col gap-6 w-full ">
            {
              loading ? (
                <h3 className="text-center text-3xl">
                <Spinner size={"lg"} />
              </h3>
              ) : (
                !loading && followingList.length > 0 ? (
                  <>
                    <input type="text" placeholder='Search' className='w-full border-none outline-none focus:ring-0 focus:border-none bg-[#efefef] placeholder:text-gray-400 text-sm rounded' onChange={handleSearch}  />
                    {
                      list.map((user) => (
                        <div className='flex justify-between items-center' key={user._id}>
                          <div className="flex gap-2 items-center">
                          <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className="w-8 h-8">
                            <img src={user.dp} alt={user.name} className='w-full h-full rounded-full' />
                          </Link>
                          <div>
                          <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className='font-medium'>{user.username}</Link>
                          <p className='text-gray-500'>{user.name}</p>
                          </div>
                          </div>
                          {
                            currentUser._id !==user._id && (
                              !currentUser.following.includes(user._id) ?  (
                                <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={()=>followUser(user._id)}>follow</button>
                              ) : (
                                    <button className='text-black bg-slate-100 px-2 py-1 rounded' onClick={()=>followUser(user._id)} >Following</button>
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
                    People you follow.
                  </h1>
                  <p className="text-gray-400">When you follow people, you'll see them here</p>
                </div>
                )
              ) 
            }
            </div>
      </div>
    </div>
  )
}
