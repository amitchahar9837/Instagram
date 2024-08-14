import { Button, Dropdown, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Comment({ comment, post, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [editedComment, setEditedComment] = useState(comment.text);
const [isEditing,setIsEditing] = useState(false);

  return (
    <div className={`w-full flex gap-2 ${isEditing ? `items-start` : `items-center`}`}>
      <Link to={`/user/${comment.postedBy._id}`}>
        <img
          src={comment.postedBy.dp}
          alt={comment.postedBy.name}
          className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
        />
      </Link>
      <div className={"flex items-start gap-1 justify-between w-full"}>
        <div className="text-gray-500 flex gap-1 w-full">
          <Link
            to={`/user/${comment.postedBy._id}`}
            className="font-semibold text-black dark:text-white"
          >
            {comment.postedBy.name + ' '}
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
                      onClick={() =>{
                        onEdit(post._id,editedComment, comment)
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
            <Dropdown arrowIcon={false} inline label={<BsThreeDotsVertical />}>
              {currentUser._id === comment.postedBy._id ? (
                <>
                  <Dropdown.Item onClick={() => setIsEditing(true)}>
                    Edit Comment
                  </Dropdown.Item>
                  <Dropdown.Item className="text-red-500" onClick={() => onDelete(post._id, comment)} >
                    Delete Comment
                  </Dropdown.Item>
                </>
              ) : (
                currentUser._id === post.postedBy._id && (
                  <Dropdown.Item className="text-red-500" onClick={() => onDelete(post._id, comment)}>
                    Delete Comment
                  </Dropdown.Item>
                )
              )}
              <Dropdown.Item>Cancel</Dropdown.Item>
            </Dropdown>
          )}
      </div>
    </div>
  );
}
