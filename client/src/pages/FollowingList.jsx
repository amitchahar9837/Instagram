import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

export default function FollowingList() {
      const [followingList, setFollowingList] = useState([]);
      const [loading,setLoading] = useState(false);
      const {currentUser} = useSelector((state) => state.user);
      const {userId} = useParams();
      const dispatch = useDispatch();
      const fetchList = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/user/followinglist/${userId}`);
          const data = await res.json();
          if (res.ok) {
            setFollowingList(data);
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

      useEffect(()=>{
        fetchList();
      },[userId])
  return (
    <div className='my-4'>
      <div className='w-full max-w-2xl mx-auto flex flex-col gap-5 p-2'>
            <h2 className='font-medium text-lg text-center'>Followings</h2>
            <input type="text" placeholder='Search' className='w-full border-none outline-none focus:ring-0 focus:border-none bg-[#efefef] placeholder:text-gray-400 text-sm rounded' />

            <div className="flex flex-col gap-6 w-full ">
            {
              loading ? (
                <h2 className='text-center font-medium text-lg'>Loading...</h2>
              ) : (
                !loading && followingList.length > 0 ? (
                  followingList.map((user) => (
                    <div className='flex justify-between items-center' key={user._id}>
                      <div className="flex gap-2 items-center">
                      <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className="w-8 h-8">
                        <img src={user.dp} alt={user.name} className='w-full h-full rounded-full' />
                      </Link>
                      <div>
                      <Link to={`${currentUser._id === user._id ? '/profile' : `/user/${user._id}`}`} className='font-medium'>{user.email}</Link>
                      <p className='text-gray-500'>{user.name}</p>
                      </div>
                      </div>
                      {
                        currentUser._id !==user._id && (
                          !currentUser.following.includes(user._id) ?  (
                            <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={()=>followUser(user._id)}>follow</button>
                          ) : (
                                <button className='text-green-500 bg-slate-100 px-2 py-1 rounded' onClick={()=>followUser(user._id)} >Following</button>
                          )
                        )
                      }
                    </div>
                  ))
                ) : (
                <h2 className='text-center font-medium text-lg'>No followings</h2>
                )
              ) 
            }
            </div>
      </div>
    </div>
  )
}
