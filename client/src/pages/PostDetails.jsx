import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import PostDetailHeader from "../components/PostDetailHeader";
import PostDetailCommentSection from "../components/PostDetailCommentSection";
import PostDetailFooter from "../components/PostDetailFooter";

export default function PostDetails() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const followUser = async (userId) => {
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/follow/${userId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updateSuccess(data.currentUser));
      } else {
        dispatch(updateFailure());
      }
    } catch (error) {
      console.log(error.message);
      dispatch(updateFailure());
    }
  };

  //delete post
  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/delete-post/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetch post detail
  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/getPostDetails/${postId}`);
      const data = await res.json();
      if (res.ok) {
        setPost(data);
        setComments(data.comments);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //create comment
  const createComment = async (postId, comment) => {
    if (comment === "") return;
    try {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });
      if (res.ok) {
        const data = await res.json();

        setPost(data);
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //like post
  const likePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/likepost/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleToDelete = (comment) => {
    setComments(comments.filter((c) => c._id !== comment._id));
  };

  const handleToEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, text: editedContent } : c
      )
    );
  };

  const handleSave = async (postId, editedComment, comment) => {
    try {
      const res = await fetch(
        `/api/post/editcomment/${postId}/${comment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: editedComment,
          }),
        }
      );
      if (res.ok) {
        handleToEdit(comment, editedComment);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async (postId, comment) => {
    try {
      const res = await fetch(
        `/api/post/deletecomment/${postId}/${comment._id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        handleToDelete(comment);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="xs:w-[75%] lg:h-screen min-h-[calc(100vh-70px)] max-w-4xl bg-white items-center flex flex-col gap-1 lg:flex-row  mx-auto p-4 rounded-md shadow-md">
      {loading ? (
        <>
          <div className="w-full lg:h-full lg:w-[48%] h-[60%] bg-slate-100 animate-pulse"></div>
          <div className="flex-1 w-full lg:h-full flex flex-col gap-1">
            <div className="w-full h-10 bg-slate-100 animate-pulse"></div>
            <div className="w-full flex-1 bg-slate-100 animate-pulse"></div>
            <div className="w-full h-10 bg-slate-100 animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          {/* Left */}
          <div className="w-full lg:h-full h-[70%] bg-slate-50 dark:bg-[rgb(16,23,42)] lg:w-[50%] p-4 flex flex-col justify-start lg:justify-center items-center">
            {/* Left Side Header */}
            <div className="lg:hidden w-full">
              <PostDetailHeader
                post={post}
                deletePost={deletePost}
                followUser={followUser}
              />
            </div>
            <div className="w-fulll xs:w-72 h-72 lg:w-full lg:h-96">
              <img
                src={post.picture}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Right */}
          <div className="flex-1 w-full lg:h-full bg-white flex-col p-4 dark:bg-[rgb(16,23,42)]">
            {/* Right Side Header */}
            <div className="hidden lg:flex w-full">
              <PostDetailHeader
                post={post}
                deletePost={deletePost}
                followUser={followUser}
              />
            </div>
            {/* Post Commment Section */}
            <PostDetailCommentSection
              post={post}
              comments={comments}
              onDelete={handleDeleteComment}
              onEdit={handleSave}
            />

            {/* Right side foooter */}
            <PostDetailFooter
              post={post}
              likePost={likePost}
              createComment={createComment}
              followUser={followUser}
            />
          </div>
        </>
      )}
    </div>
  );
}
