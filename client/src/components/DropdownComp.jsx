import React, { useState } from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DropdownComp({ post, followUser, deletePost }) {
  const { currentUser } = useSelector((state) => state.user);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showDeletePostModal,setShowDeletePostModal] = useState(false)
  return (
    <>
      {/* Dropdown menu */}
      <Dropdown arrowIcon={false} inline label={<BsThreeDots />}>
        {currentUser.following.includes(post.postedBy._id) && (
          <Dropdown.Item
            className="text-red-500"
            onClick={() => setShowUnfollowModal(true)}
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
          <Dropdown.Item onClick={() => setShowDeletePostModal(true)}>
            Delete post
          </Dropdown.Item>
        )}
        <Dropdown.Item>Cancel</Dropdown.Item>
      </Dropdown>
      {/* Unfollow Modal */}
      <Modal
        show={showUnfollowModal}
        onClick={() => setShowUnfollowModal(false)}
        size={"md"}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to unfollow?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={() => followUser(post.postedBy._id)}
              >
                Yes I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowUnfollowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Delete Post Modal */}
      <Modal
        show={showDeletePostModal}
        onClick={() => setShowDeletePostModal(false)}
        size={"md"}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={() => deletePost(post._id)}
              >
                Yes I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowDeletePostModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
