import { Button, Dropdown, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DropdownComment from "./DropdownComment";

export default function Comment({ comment, post, onDelete, onEdit }) {
  const { currentUser } = useSelector((state) => state.user);
  const [editedComment, setEditedComment] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`w-full flex  gap-2 ${
        isEditing ? `items-start` : `items-center`
      }`}
    >
      <Link
        to={`${
          currentUser._id === comment.postedBy._id
            ? `/profile`
            : `/user/${comment.postedBy._id}`
        }`}
      >
        <img
          src={comment.postedBy.dp}
          alt={comment.postedBy.name}
          className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
        />
      </Link>
      <div className={`flex-1 flex ${isEditing ? `flex-col` : `flex-row`}`}>
        <div className="text-gray-500 flex gap-1 w-full flex-wrap">
          <Link
            to={`${currentUser._id === comment.postedBy._id ? "/profile" : `/user/${comment.postedBy._id}`}`}
            className="font-semibold text-black dark:text-white"
          >
            {comment.postedBy.name + " "}
          </Link>
          {isEditing ? (
            <div className="w-[100%] flex flex-col">
              <Textarea
                className="mb-2 resize-none w-full"
                rows={"2"}
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  className="px-3 py-1 rounded border border-black dark:border-gray-200"
                  onClick={() => {
                    onEdit(post._id, editedComment, comment);
                    setIsEditing(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded border border-black dark:border-gray-200"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            comment.text
          )}
        </div>
        {(currentUser._id == comment.postedBy._id ||
          currentUser._id == post.postedBy._id) &&
          !isEditing && (
            <DropdownComment
              post={post}
              comment={comment}
              setIsEditing={setIsEditing}
              onDelete={onDelete}
            />
          )}
      </div>
    </div>
  );
}
