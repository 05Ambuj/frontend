import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PostContext = createContext();
const BEAPI=import.meta.env.BACKEEND_URL;
export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  async function fetchPosts() {
    try {
      const { data } = await axios.get(`${BEAPI}/api/post/all`);

      setPosts(data.posts);
      setReels(data.reels);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function addPost(formData, setFile, setCaption, setFilePrev, type) {
    setAddLoading(true);
    try {
      const { data } = await axios.post(`${BEAPI}/api/post/new?type=` + type, formData);
      toast.success(data.message);
      fetchPosts();
      setFile("");
      setFilePrev("");
      setCaption("");
      setAddLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setAddLoading(false);
    }
  }

  async function likePost(id) {
    try {
      const { data } = await axios.post(`${BEAPI}/api/post/like/` + id);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addComment(id, comment, setComment, setShow) {
    try {
      const { data } = await axios.post(`${BEAPI}/api/post/comment/` + id, {
        comment,
      });
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePost(id) {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${BEAPI}/api/post/` + id);
      toast.success(data.message);
      fetchPosts();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function deleteComment(id,commentId) {
    try {
      const {data}=await axios.delete(`${BEAPI}/api/post/comment/${id}?commentId=${commentId}`)
      toast.success(data.message)
      fetchPosts()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        reels,
        posts,
        addPost,
        likePost,
        addComment,
        loading,
        addLoading,
        fetchPosts,
        deletePost,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
