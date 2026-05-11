import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/dp.png";
import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from "../context/UserContext.jsx";
import EditProfile from "../components/EditProfile.jsx";
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post.jsx";

function Home() {
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData, edit, setEdit, postData, setPostData } =
    useContext(userDataContext);
  let [createPost, setCreatePost] = useState(false);
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [suggestedUser, setSuggestedUser] = useState("");

  let image = useRef();

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);

    setFrontendImage(URL.createObjectURL(file));
  }

  let [creatingPost, setCreatingPost] = useState(false);
  async function handleUploadPost() {
    setCreatingPost(true);
    try {
      let formData = new FormData();
      formData.append("description", description);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(serverUrl + "/api/post/create", formData, {
        withCredentials: true,
      });
      console.log(result);
      setCreatingPost(false);
      setCreatePost(false);
    } catch (error) {
      console.log(error);
      setCreatingPost(false);
    }
  }

  const handleSuggestedUser = async () => {
    try {
      let result = await axios.get(serverUrl+'/api/user/suggestedusers',{withCredentials:true})
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleSuggestedUser()
  },[])


  return (
    <>
      <Nav />
      {edit && <EditProfile setEdit={setEdit} />}

      {/* create post popup  */}
      {createPost && (
        <div className="w-full min-h-[100vh] flex justify-center items-center fixed top-0  z-[100]">
          <div className="w-full h-[100vh] bg-black opacity-[0.6] absolute"></div>
          <div className="w-[90%] max-w-[500px] h-[600px] bg-white z-[200] relative rounded-lg overflow-auto mb-2">
            <div className="flex  items-center p-4 gap-3">
              <div className="h-[60px] w-[60px] rounded-full overflow-hidden  flex items-center justify-center cursor-pointer ">
                <img
                  src={userData.profileImage || dp}
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <p className="font-semibold text-[18px] text-gray-700">{`${userData.firstName} ${userData.lastName}`}</p>
              <div
                className="absolute top-2 right-2 text-2xl text-gray-700 cursor-pointer  "
                onClick={() => setCreatePost(false)}
              >
                <RxCross2 />
              </div>
            </div>
            <div className="mx-5 my-3 mb-3">
              <textarea
                className={`outline-none resize-none w-full ${
                  frontendImage ? "h-[200px]" : "h-[350px]"
                }  px-2 py-1 text-gray-700 text-[17px]`}
                placeholder="What do you want to talk about?"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {frontendImage && (
                <div className="w-full h-[250px] overflow-hidden  ">
                  <img
                    src={frontendImage || ""}
                    alt=""
                    className="w-[100%] h-[100%] object-contain"
                  />
                </div>
              )}

              <div className="text-2xl text-gray-700 my-3 mx-3 ">
                <BsImage
                  className="cursor-pointer"
                  onClick={() => image.current.click()}
                />
              </div>
              <input
                type="file"
                hidden
                ref={image}
                onChange={(e) => handleImage(e)}
              />

              <div className="border-1 border-gray-500 mb-4"></div>
              <button
                className="bg-blue-500 text-white w-[100px] py-1.5 rounded-full sm:ml-[78%]  ml-[55%] cursor-pointer "
                onClick={() => handleUploadPost()}
              >
                {creatingPost ? "posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full min-h-[100vh] bg-[#f5f3ec] pt-[100px] flex flex-col lg:flex-row 
       items-start justify-start gap-[20px] px-[20px] mb-3 "
      >
        <div className="w-full  lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative ">
          <div className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer">
            <img src={userData.coverImage || ""} alt="" className="w-full" />
            <FiCamera className="absolute top-4 right-4 text-xl text-slate-100 " />
          </div>
          <div className="h-[60px] w-[60px] rounded-full overflow-hidden  flex items-center justify-center absolute top-[70px] left-[30px] cursor-pointer">
            <img
              src={userData.profileImage || dp}
              alt=""
              className="h-full w-full"
            />
          </div>
          <div className="w-[20px] h-[20px] flex items-center justify-center bg-[#17c1ff] absolute top-25.5 left-18.5 rounded-full">
            <FaPlus className="text-[12px] text-white cursor-pointer" />
          </div>

          <div className="mt-5.5 ml-3">
            <p className="font-semibold text-lg text-gray-700">{`${userData.firstName} ${userData.lastName}`}</p>
            <p className="text-gray-600">{userData.headline || ""}</p>
            <p className="text-gray-500">{userData.location}</p>
            <button
              className="flex border-2 border-blue-400 w-full justify-center items-center py-1 rounded-full ml-[-10px] text-blue-400 gap-1 shadow-md mt-7 mb-2 cursor-pointer"
              onClick={() => setEdit(true)}
            >
              Edit Profile
              <MdEdit className="" />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[50%] min-h-[200px] bg-[#f5f3ec] shadow-lg flex flex-col gap-[20px]">
          <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex justify-center items-center gap-4 lg:gap-7 px-3">
            <div className="h-[60px] w-[60px] rounded-full overflow-hidden  flex items-center justify-center cursor-pointer ">
              <img
                src={userData.profileImage || dp}
                alt=""
                className="h-full w-full"
              />
            </div>
            <button
              className="border-2 border-gray-700 text-gray-700 w-[70%] py-2 px-4 rounded-full text-left cursor-pointer hover:bg-slate-100 duration-300"
              onClick={() => setCreatePost(true)}
            >
              Strat a post...
            </button>
          </div>
          {postData.map((post, index) => (
            <Post
              key={index}
              id={post._id}
              description={post.description}
              image={post.image}
              like={post.like}
              comment={post.comment}
              author={post.author}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg hidden lg:flex flex-col">
          <h1 className="w-full flex justify-center font-semibold text-xl text-gray-600 mt-4 text-shadow-lg">Suggested user</h1>
            {suggestedUser.length > 0 ? <div className="p-[20px] flex flex-col gap-4.5">
               {suggestedUser.map((user,i)=>(
                <div className="flex gap-1.5 items-center border-b-2 border-gray-200 p-[5px]" key={i}>
                <div className="h-[50px] w-[50px] rounded-full overflow-hidden  flex items-center justify-center cursor-pointer ">
                <img
                  src={user.profileImage || dp}
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <p className=" text-[18px] text-gray-700">{`${user.firstName} ${user.lastName}`}</p>
              </div>
               ))}
              </div>:<div className="h-[100%] flex justify-center items-center  p-[20px]"><h1 className="text-xl text-gray-700 font-semibold">No suggested User!!</h1></div>}
        </div>
      </div>
    </>
  );
}

export default Home;
