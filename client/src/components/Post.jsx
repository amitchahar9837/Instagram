import React, { useEffect, useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdClose, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown, Spinner } from "flowbite-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuSendHorizonal } from "react-icons/lu";
import Comment from "./Comment";
import LikeList from "./LikeList";
export default function Post({
  post,
  likePost,
  createComment,
  deletePost,
  followUser,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setCommentModal] = useState(false);
  // const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [likesToFetch, setLikesToFetch] = useState(null);
  const [likesList, setLikesList] = useState([]);
  const [comment, setComment] = useState("");
  const [comments,setComments] = useState(post.comments);


  const fetchLikes = async () => {
    try {
      setLoadingLikes(true);
      const res = await fetch(`/api/post/likelist/${likesToFetch}`);
      const data = await res.json();
      if (res.ok) {
        setLikesList(data);
        setLoadingLikes(false);
      }
    } catch (error) {
      setLoadingLikes(false);
    }
  };

  const handleToEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, text: editedContent } : c
      )
    );
  };

  const handleToDelete = async (comment) =>{
    setComments(comments.filter((c) => c._id !== comment._id))
  }

  const handleSave = async (postId, editedComment,comment) => {
    try {
      const res = await fetch(`/api/post/editcomment/${postId}/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  
          text: editedComment,
        }),
      });
      if (res.ok) {
        handleToEdit(comment, editedComment);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async (postId,comment) =>{
    try {
      const res = await fetch(`/api/post/deletecomment/${postId}/${comment._id}`, {
        method: "DELETE",});
      if (res.ok) {
        handleToDelete(comment);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    likesToFetch && fetchLikes();
  }, [likesToFetch]);

  return (
    <div className="w-[90%] md:max-w-xl dark:text-gray-100 rounded-md shadow-lg flex flex-col gap-4 p-4 border">
      <div className=" w-full flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link
            to={`${
              currentUser._id === post.postedBy._id
                ? "/profile"
                : `/user/${post.postedBy._id}`
            }`}
          >
            <img
              src={post && post.postedBy && post.postedBy.dp}
              alt="user"
              className="w-8 h-8 rounded-full"
            />
          </Link>
          <div className="flex gap-1 items-center text-sm">
            <Link
              to={`${
                currentUser._id === post.postedBy._id
                  ? "/profile"
                  : `/user/${post.postedBy._id}`
              }`}
              className="font-semibold text-md"
            >
              {post && post.postedBy && post.postedBy.name}
            </Link>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">
              {moment(post.createdAt).fromNow()}
            </span>
            {currentUser._id !== post.postedBy._id &&
              !currentUser.following.includes(post.postedBy._id) && (
                <>
                  <span className="text-gray-300">•</span>
                  <span
                    className="text-blue-500 font-medium cursor-pointer"
                    onClick={() => followUser(post.postedBy._id)}
                  >
                    follow
                  </span>
                </>
              )}
          </div>
        </div>
        <Dropdown arrowIcon={false} inline label={<BsThreeDotsVertical />}>
          {currentUser.following.includes(post.postedBy._id) && (
            <Dropdown.Item
              className="text-red-500"
              onClick={() => followUser(post.postedBy._id)}
            >
              Unfollow
            </Dropdown.Item>
          )}
          <Dropdown.Item>
            <Link
              to={`${
                currentUser._id === post.postedBy._id
                  ? "/profile"
                  : `/user/${post.postedBy._id}`
              }`}
            >
              View profile
            </Link>
          </Dropdown.Item>
          {currentUser._id === post.postedBy._id && (
            <Dropdown.Item onClick={() => deletePost(post._id)}>
              Delete post
            </Dropdown.Item>
          )}
          <Dropdown.Item>Cancel</Dropdown.Item>
        </Dropdown>
      </div>
      <div className="w-full sm:w-96 h-96 mx-auto">
        <img
          src={post && post.picture}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center text-2xl px-2">
          {post.likes.includes(currentUser._id) ? (
            <MdFavorite
              style={{
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => likePost(post._id)}
            />
          ) : (
            <MdFavoriteBorder
              style={{ cursor: "pointer" }}
              onClick={() => {
                likePost(post._id);
              }}
            />
          )}
          <FaRegComment
            onClick={() => setCommentModal(true)}
            className=" font-semibold text-xl hover:font-bold hover:scale-105 cursor-pointer"
          />
        </div>
        <div className="text-sm px-2">
          {post.likes.length > 0 && (
            <h2
              className="font-medium cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setLikesToFetch(post._id);
              }}
            >
              {post.likes.length > 1
                ? `${post.likes.length} likes`
                : `${post.likes.length} like`}
            </h2>
          )}
          <div className="mt-2 cursor-pointer">
            {comments.length > 0 && (
              <h3 className="font-semibold" onClick={() => setCommentModal(true)}>{`view all ${
                comments.length === 1
                  ? `${comments.length} comment`
                  : `${comments.length} comments`
              }`}</h3>
            )}
          </div>
        </div>
        <div className="px-2">
          <h2 className="font-medium">{post.title}</h2>
          <h3>{post.body}</h3>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full -mt-2 pb-2 flex justify-between items-center border-b-2 border-slate-300 "
        >
          <textarea
            rows={1}
            placeholder="Add a comment"
            className="w-full resize-none noScrollbar border-none outline-none focus:ring-0 focus:border-none bg-transparent placeholder:text-gray-400 text-md"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          {comment.length > 0 && (
            <button
              type="button"
              className="pr-4"
              onClick={() => {
                createComment(post._id, comment);
                setComment("");
              }}
            >
              <LuSendHorizonal className="text-xl text-blue-500" />
            </button>
          )}
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white dark:bg-gray-700 max-h-[600px] rounded-md flex flex-col p-2">
            <div className="w-full relative flex items-center justify-between py-2">
              <div className=" w-full flex-col items-center justify-center">
                <h3 className="font-medium text-center flex-1">Likes</h3>
                {currentUser._id === post.postedBy._id && likesList && (
                  <>
                    <div className="flex justify-center items-center gap-1">
                      <MdFavorite
                        style={{
                          color: "black dark:white",
                          cursor: "pointer",
                        }}
                      />
                      <span>{likesList && likesList.length}</span>
                    </div>
                    <p className="text-gray-400 text-center text-sm md:text-md">
                      Only you can see total number of likes on this post
                    </p>
                  </>
                )}
              </div>
              <MdClose
                className="text-2xl cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="w-full h-[2px] bg-gray-300 my-2"></div>
            {loadingLikes ? (
              <h3 className="logo text-center text-3xl">
                <Spinner size={"lg"} />
              </h3>
            ) : (
              <div className="p-2 max-h-[400px] overflow-y-auto noScrollbar flex flex-col gap-5">
                {likesList && likesList.length > 0 ? (
                  <>
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full border-none outline-none focus:ring-0 focus:border-none bg-[#efefef] placeholder:text-gray-400 text-sm rounded"
                    />
                    {likesList.map((user,index) => (
                      <LikeList user={user} key={user._id + index} followUser={followUser} />
                    ))}
                  </>
                ) : (
                  <>
                    <h3 className="text-center text-xl font-semibold">
                      No Likes
                    </h3>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 py-5">
          <MdClose
            className="text-3xl cursor-pointer text-white absolute top-2 right-2 md:top-4 md:right-2"
            onClick={() => setCommentModal(false)}
          />
          <div className="h-full w-[80%] md:w-[60%] lg:w-[70%] bg-white flex flex-col lg:flex-row overflow-y-auto">
            <div className="w-full lg:h-full h-[60%] bg-slate-100 dark:bg-[rgb(16,23,42)] lg:w-[48%] p-4 flex flex-col justify-start lg:justify-center items-center">
            <div className="flex lg:hidden justify-between items-center w-full px-2 pb-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/user/${post.postedBy._id}`}>
                      <img
                        src={post.postedBy.dp}
                        alt=""
                        className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
                      />
                    </Link>
                    <div className="flex gap-1 items-center">
                      <Link
                        to={`/user/${post.postedBy._id}`}
                        className="font-medium"
                      >
                        {post.postedBy.name}
                      </Link>
                      {currentUser._id !== post.postedBy._id &&
                        !currentUser.following.includes(post.postedBy._id) && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-blue-500 font-semibold cursor-pointer text-sm">
                              follow
                            </span>
                          </>
                        )}
                    </div>
                  </div>
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={<BsThreeDotsVertical />}
                  >
                    {currentUser.following.includes(post.postedBy._id) && (
                      <Dropdown.Item
                        className="text-red-500"
                        onClick={() => followUser(post.postedBy._id)}
                      >
                        Unfollow
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item>
                      <Link
                        to={`${
                          currentUser._id === post.postedBy._id
                            ? "/profile"
                            : `/user/${post.postedBy._id}`
                        }`}
                      >
                        View profile
                      </Link>
                    </Dropdown.Item>
                    {currentUser._id === post.postedBy._id && (
                      <Dropdown.Item onClick={() => deletePost(post._id)}>
                        Delete post
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item>Cancel</Dropdown.Item>
                  </Dropdown>
                </div>
              <div className="w-60 h-60 lg:w-80 lg:h-80 mx-auto">
                <img
                  src={post.picture}
                  alt={"post"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="h-full flex-1 flex-col dark:bg-[rgb(16,23,42)]">
              <div className="py-2 lg:py-4 lg:pb-5 border-b-[2px] border-gray-100">
                <div className="hidden lg:flex justify-between items-center w-full px-2">
                  <div className="flex items-center gap-2">
                    <Link to={`/user/${post.postedBy._id}`}>
                      <img
                        src={post.postedBy.dp}
                        alt=""
                        className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
                      />
                    </Link>
                    <div className="flex gap-1 items-center">
                      <Link
                        to={`/user/${post.postedBy._id}`}
                        className="font-medium"
                      >
                        {post.postedBy.name}
                      </Link>
                      {currentUser._id !== post.postedBy._id &&
                        !currentUser.following.includes(post.postedBy._id) && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-blue-500 font-semibold cursor-pointer text-sm">
                              follow
                            </span>
                          </>
                        )}
                    </div>
                  </div>
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={<BsThreeDotsVertical />}
                  >
                    {currentUser.following.includes(post.postedBy._id) && (
                      <Dropdown.Item
                        className="text-red-500"
                        onClick={() => followUser(post.postedBy._id)}
                      >
                        Unfollow
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item>
                      <Link
                        to={`${
                          currentUser._id === post.postedBy._id
                            ? "/profile"
                            : `/user/${post.postedBy._id}`
                        }`}
                      >
                        View profile
                      </Link>
                    </Dropdown.Item>
                    {currentUser._id === post.postedBy._id && (
                      <Dropdown.Item onClick={() => deletePost(post._id)}>
                        Delete post
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item>Cancel</Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
              <div className="flex flex-col  gap-3 lg:gap-6 p-2 lg:pt-4 h-[58%] overflow-y-auto noScrollbar">
                {
                  post.title === '' && comments.length <=0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <h1 className="font-semibold text-xl lg:text-3xl">No comments yet.</h1>
                      <p className="text-gray-400">Start the conversation</p>
                    </div>
                  ) : (
                    <>
                    {post.title !== '' && (
                      <div className="w-full flex items-center gap-2 mb-1">
                      <Link to={`/user/${post.postedBy._id}`}>
                        <img
                          src={post.postedBy.dp}
                          alt={post.postedBy.name}
                          className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
                        />
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/user/${post.postedBy._id}`}
                          className="font-semibold"
                        >
                          {post.postedBy.name}
                        </Link>
                        <p className="text-gray-500">{post.title}</p>
                      </div>
                    </div>
                    ) }
                    {comments.map((comment,index) => (
                      <Comment key={comment._id + index}  comment={comment} post={post} onEdit={handleSave} onDelete={handleDeleteComment} />
                    ))}
                    </>
                  )
                }

              </div>
              <div className="w-full border-t-[1px] border-gray-200 py-1 lg:py-4 flex lg:flex-col flex-row lg:justify-start justify-between">
                <div className="flex items-center gap-4 px-2 text-2xl">
                  {post.likes.includes(currentUser._id) ? (
                    <MdFavorite
                      style={{
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => likePost(post._id)}
                    />
                  ) : (
                    <MdFavoriteBorder
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        likePost(post._id);
                      }}
                    />
                  )}
                  <FaRegComment className=" font-semibold text-xl hover:font-bold hover:scale-105 cursor-pointer" />
                </div>
                {post.likes.length > 0 ? (
                  <p
                    className="font-semibold px-2 cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setLikesToFetch(post._id);
                    }}
                  >{`${post.likes.length} ${
                    post.likes.length > 1 ? "likes" : "like"
                  }`}</p>
                ) : (
                  <p className="px-2">Be the first to <span className="font-semibold cursor-pointer" onClick={()=>{likePost(post._id)}}>like this</span></p>
                )}
                <span className="text-gray-500 text-sm px-2">{moment(post.createdAt).fromNow()}</span>
              </div>
              <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full py-1 lg:py-2 flex justify-between items-center border-t border-gray-200 "
        >
          <textarea
            rows={1}
            placeholder="Add a comment"
            className="w-full resize-none noScrollbar border-none outline-none focus:ring-0 focus:border-none bg-transparent placeholder:text-gray-400 text-md"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          {comment.length > 0 && (
            <button
              type="button"
              className="pr-4"
              onClick={() => {
                createComment(post._id, comment);
                setComment("");
              }}
            >
              <LuSendHorizonal className="text-xl text-blue-500" />
            </button>
          )}
        </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
