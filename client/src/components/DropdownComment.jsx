import React, { useState } from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DropdownComment({ comment, post, setIsEditing, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [showDeleteCommentModal,setShowDeleteCommentModal] = useState(false)
  return (
    <>
      {/* Dropdown menu */}
      <Dropdown arrowIcon={false} inline label={<BsThreeDotsVertical />}>
      {currentUser._id === comment.postedBy._id ? (
                <>
                  <Dropdown.Item onClick={() => setIsEditing(true)}>
                    Edit Comment
                  </Dropdown.Item>
                  <Dropdown.Item className="text-red-500" onClick={()=>setShowDeleteCommentModal(true)} >
                    Delete Comment
                  </Dropdown.Item>
                </>
              ) : (
                currentUser._id === post.postedBy._id && (
                  <Dropdown.Item className="text-red-500" onClick={()=>setShowDeleteCommentModal(true)}>
                    Delete Comment
                  </Dropdown.Item>
                )
              )}
              <Dropdown.Item>Cancel</Dropdown.Item>
      </Dropdown>

      {/* Delete Comment Modal */}
      <Modal
        show={showDeleteCommentModal}
        onClick={() => setShowDeleteCommentModal(false)}
        size={"md"}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Commment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={()=>{
                  onDelete(post._id, comment)
                }}
              >
                Yes I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowDeleteCommentModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
