import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();
const BEAPI=import.meta.env.BACKEEND_URL;
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(formData, navigate,fetchPosts) {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BEAPI}/api/auth/register`, formData);
      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/");
      setLoading(false);
      fetchPosts()
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function loginUser(email, password, navigate,fetchPosts) {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BEAPI}/api/auth/login`, {
        email,
        password,
        navigate,
      });
      toast.success(data.message);
      navigate("/");
      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
      fetchPosts()
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.get(`${BEAPI}/api/auth/logout`);

      if (data.message) {
        toast.success(data.message);
        setUser([]);
        setIsAuth(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${BEAPI}/api/user/me`);
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      setIsAuth(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function followUser(id,fetchUser) {
    try {
      const { data } = await axios.post(`${BEAPI}/api/user/follow/${id}`);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateProfile(id,formData,setFile) {
    try {
      const { data } = await axios.put(`${BEAPI}/api/user/${id}`,formData);
      toast.success(data.message);
      setFile(null)
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function updateProfileName(id,name,setShowInput) {
    try {
      const { data } = await axios.put(`${BEAPI}/api/user/${id}`,{name});
      toast.success(data.message);
      fetchUser();
      setShowInput(false)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  return (
    <UserContext.Provider
      value={{
        loginUser,
        isAuth,
        setIsAuth,
        loading,
        setLoading,
        user,
        setUser,
        logoutUser,
        registerUser,
        followUser,
        updateProfile,
        updateProfileName
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
