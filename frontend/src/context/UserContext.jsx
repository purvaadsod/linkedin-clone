import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userDataContext = createContext();
function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  let { serverUrl } = useContext(authDataContext);
  let [edit,setEdit] = useState(false)
  let [profileData,setProfileData] = useState([])

  let navigate = useNavigate()
  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
      setUserData(null)
    }
  };


  const getPost = async ()=>{
    try {
      let result = await axios.get(serverUrl + '/api/post/getpost',{withCredentials:true})
      setPostData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(serverUrl + `/api/user/profile/${userName}`,{withCredentials:true})
      setProfileData(result.data)
      navigate(`/profile/${userName}`)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCurrentUser();
    getPost()
  }, []);

  let value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
