import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdClose, MdFavorite } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function LikeList({ post, followUser, setShowLikes }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [likesData, setLikesData] = useState([]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/likelist/${post._id}`);
      const data = await res.json();
      if (res.ok) {
        setLikesData(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLikes();
  }, [post]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-700 max-h-[600px] rounded-md flex flex-col p-2">
        <div className="w-full relative flex items-start justify-between py-2">
          <div className=" w-full flex-col items-center justify-center">
            <h3 className="font-medium text-center flex-1">Likes</h3>
            {currentUser._id === post.postedBy._id && (
              <>
                <div className="flex justify-center items-center gap-1">
                  <MdFavorite
                    style={{
                      color: "black dark:white",
                      cursor: "pointer",
                    }}
                  />
                  <span>{likesData && likesData.length}</span>
                </div>
                <p className="text-gray-400 text-center text-sm md:text-md">
                  Only you can see total number of likes on this post
                </p>
              </>
            )}
          </div>
          <MdClose
            className="text-2xl cursor-pointer"
            onClick={() => setShowLikes(false)}
          />
        </div>
        <div className="w-full h-[2px] bg-gray-300 my-2"></div>
        {loading ? (
          <>
            <h3 className="logo text-center text-3xl">
              <Spinner size={"lg"} />
            </h3>
          </>
        ) : (
          <div className="p-2 max-h-[400px] overflow-y-auto noScrollbar flex flex-col gap-5">
            {likesData && likesData.length > 0 ? (
              <>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full border-none outline-none focus:ring-0 focus:border-none bg-[#efefef] placeholder:text-gray-400 text-sm rounded"
                />
                {likesData.map((user, index) => (
                  <div
                    className="flex justify-between items-center w-full"
                    key={user._id + index}
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
                ))}
              </>
            ) : (
              <>
                <h3 className="text-center text-xl font-semibold">No Likes</h3>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
