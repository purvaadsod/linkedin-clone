import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import dp from "../assets/dp.png";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import EditProfile from "../components/EditProfile";
import Post from "../components/Post";
import ConnectionButton from "../components/ConnectionButton";

function Profile() {
  let { serverUrl } = useContext(authDataContext);
  let {
    userData,
    setuserData,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData,
  } = useContext(userDataContext);

  let [userConnection, setUserConnection] = useState(profileData.connection || []);

  let [profilePost, setProfilePost] = useState([]);

  const handleGetUserConnection = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection`, {
        withCredentials: true,
      });
      setUserConnection(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUserConnection();
  }, []);

  useEffect(() => {
    setProfilePost(
      postData.filter((post) => post.author._id == profileData._id)
    );
  }, [profileData]);

  return (
    <>
      {edit && <EditProfile setEdit={setEdit} />}
      <div className="w-full min-h-[100vh] bg-[#f5f3ec] flex flex-col items-center pb-[40px]">
        <Nav />
        <div className="w-full max-w-[900px] min-h-[100vh]">
          <div className="pt-[100px]">
            <div className="w-full min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative px-[10px] ">
              <div className="w-[100%] h-[150px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer">
                <img
                  src={profileData.coverImage || ""}
                  alt=""
                  className="w-full"
                />
                <FiCamera className="absolute top-4 right-4 text-xl text-slate-100 " />
              </div>
              <div className="h-[60px] w-[60px] rounded-full overflow-hidden  flex items-center justify-center absolute top-[130px] left-[30px] cursor-pointer">
                <img
                  src={profileData.profileImage || dp}
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <div className="w-[20px] h-[20px] flex items-center justify-center bg-[#17c1ff] absolute top-39.5 left-18.5 rounded-full">
                <FaPlus className="text-[12px] text-white cursor-pointer" />
              </div>

              <div className="mt-7.5 ml-3">
                <p className="font-semibold text-lg text-gray-700">{`${profileData.firstName} ${profileData.lastName}`}</p>
                <p className="text-gray-600">{profileData.headline || ""}</p>
                <p className="text-gray-500">{profileData.location}</p>
                <p className="text-gray-500">
                  {userConnection ? userConnection.length : 0} Connection
                  {userConnection && userConnection.length !== 1 ? "s" : ""}
                </p>
                {profileData._id == userData._id ? (
                  <button
                    className="flex border-2 border-blue-400 justify-center items-center py-1 rounded-full ml-[-10px] text-blue-400 gap-1 shadow-md mt-7 mb-2 cursor-pointer w-[150px]"
                    onClick={() => setEdit(true)}
                  >
                    Edit Profile
                    <MdEdit className="" />
                  </button>
                ) : (
                  <div className="mt-3">
                    <ConnectionButton userId={profileData._id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg mt-[10px]">{`Post (${profilePost.length})`}</div>
          <div className="my-[10px]">
            {profilePost.map((post, i) => (
              <div className="my-[10px]">
                <Post
                  key={i}
                  id={post._id}
                  description={post.description}
                  image={post.image}
                  like={post.like}
                  comment={post.comment}
                  author={post.author}
                  createdAt={post.createdAt}
                />
              </div>
            ))}
          </div>

          {profileData.skills.length > 0 && (
            <div>
              <div className="w-full h-[90px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg mt-[10px]">
                Skills
              </div>
              {profileData.skills.map((skill) => (
                <div className="bg-white my-[5px] h-[40px] flex items-center font-semibold text-gray-700 px-[20px]">
                  {skill}
                </div>
              ))}
            </div>
          )}

          {profileData.experience.length > 0 && (
            <div>
              <div className="w-full h-[90px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg mt-[10px]">
                Experience
              </div>
              {profileData.experience.map((ex) => (
                <div className="bg-white my-[5px] h-[100px] flex flex-col justify-center font-semibold text-gray-700 px-[20px]">
                  <p>Title : {ex.title}</p>
                  <p>Company : {ex.company}</p>
                  <p>Description : {ex.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
