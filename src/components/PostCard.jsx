import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { format } from "date-fns";
import { RiDeleteBin6Line } from "react-icons/ri";
import ThreeDotModal from "./ThreeDotModal";
import { Loading, LoadingAnimation } from "./Loading";
import toast from "react-hot-toast";
import axios from "axios";

const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [caption, setCaption] = useState(value.caption ? value.caption : "");
  const [captionLoading, setCaptionLoading] = useState(false);

  const { user } = UserData();
  const { fetchPosts, likePost, addComment, deletePost, loading , deleteComment} = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === user._id) setIsLike(true);
    }
  }, [value, user._id]);

  const likeHandler = () => {
    setIsLike(!isLike);
    likePost(value._id);
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    addComment(value._id, comment, setComment, setShow);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const deleteHandler = () => {
    deletePost(value._id);
  };

  const editHandler = () => {
    setShowModal(false);
    setShowInput(true);
  };

  async function updateCaption() {
    setCaptionLoading(true);
    try {
      const { data } = await axios.put("/api/post/" + value._id, { caption });
      toast.success(data.message);
      fetchPosts();
      setShowInput(false);
      setCaptionLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setCaptionLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 flex justify-center items-center pt-3 pb-14">
      <ThreeDotModal isOpen={showModal} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={editHandler}
            className="bg-blue-400 text-white py-1 px-3 rounded-m"
          >
            Edit
          </button>
          <button
            onClick={deleteHandler}
            className="bg-red-400 text-white py-1 px-3 rounded-md cursor-pointer"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </ThreeDotModal>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="flex items-center justify-between space-x-2">
          <Link to={`/user/${value.owner._id}`}>
            <div className="flex flex-row gap-2 pb-1 ">
              <img
                src={value.owner.profilePic.url}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-semibold">
                  {value.owner.name}
                </p>
                <div className="text-gray-500 text-sm">{formatDate}</div>
              </div>
            </div>
          </Link>
          {value.owner._id === user._id && (
            <div className="text-gray-500 ">
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer hover:bg-gray-50 rounded-full p-1 text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          {showInput ? (
            <>
              <div className="flex flex-row justify-between items-center">
                <input
                  type="text"
                  className="custom-input max-w-[250px] "
                  placeholder="Enter Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                />
                <div>
                  <button
                    onClick={updateCaption}
                    className="text-sm bg-blue-500 text-white px-1 py-1"
                    disabled={captionLoading}
                  >
                    {captionLoading ? <LoadingAnimation /> : "Update"}
                  </button>
                  <button
                    onClick={() => setShowInput(false)}
                    className="text-sm bg-gray-500 text-white mx-[2px] px-1 py-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-800">{value.caption}</p>
          )}
        </div>

        <div className="mb-4">
          {type === "posts" ? (
            <img
              src={value.post.url}
              alt="Post Image"
              className="w-[450px] h-[500px] object-contain rounded-md"
            />
          ) : (
            <video
              src={value.post.url}
              alt=""
              className="w-[450px] h-[600px] object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span
              onClick={likeHandler}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>
            <button className="hover:bg-gray-50 rounded-full p-1">
              {value.likes.length} likes
            </button>
          </div>
          <button
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>
        {show && (
          <form onSubmit={addCommentHandler} className="flex gap-3">
            <input
              type="text"
              className="custom-input"
              placeholder="Enter Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="bg-gray-100 rounded-lg px-5 py-2">
              Add
            </button>
          </form>
        )}
        <hr className="mt-2 mb-2" />
        <p className="text-gray font-semibold"> Comments</p>
        <hr className="mt-2 mb-2" />
        <div className="mt-4 ">
          <div className="comments max-h-[200px] overflow-y-auto">
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((e) => (
                <Comment value={e} key={e._id} user={user} owner={value.owner._id} id={value._id}/>
              ))
            ) : (
              <p>No Comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

export const Comment = ({ value, user ,owner, id}) => {
  const {deleteComment}=PostData()
  const deleteCommentHandler=()=>{
    deleteComment(id,value._id)
  }
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          alt="comment user image"
          className="w-8 h-8 rounded-full"
        />
      </Link>
      <div>
        <Link to={`/user/${value.user._id}`}>
          <p className="text-gray-800 font-semibold">{value.user.name}</p>
        </Link>
        <p className="text-gray-500 font-sm">{value.comment}</p>
      </div>
      {owner=== user._id ? (
        ""
      ) : (
        <>
          {value.user._id === user._id && (
            <button onClick={deleteCommentHandler} className="text-red-500">
              <RiDeleteBin6Line />
            </button>
          )}
        </>
      )}
      {owner=== user._id && (
        <button onClick={deleteCommentHandler} className="text-red-500">
          <RiDeleteBin6Line />
        </button>
      )}
    </div>
  );
};
