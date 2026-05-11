import React, { useContext, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import dp from "../assets/dp.png";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
 let {serverUrl} = useContext(authDataContext);

  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [headline, setHeadline] = useState(userData.headline || "");
  const [location, setLocation] = useState(userData.location || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkills, setNewSkills] = useState("");
  const [experience, setExperience] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: "",
      });
 

      const profileImage = useRef()
  const coverImage = useRef()

  const [frontendProfileImage,setFrontendProfileImage] = useState(userData.profileImage || dp)
  const [backendProfileImage,setBackendProfileImage] = useState(null)
  const [frontendCoverImage,setFrontendCoverImage] = useState(userData.coverImage || null)
  const [backendCoverImage,setBackendCoverImage] = useState(null)

  function addSkills() {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  function removeSkills(skill) {
    if (skill && skills.includes(skill)) {
      setSkills(skills.filter((sk, i) => sk != skill));
    }
  }


  function addExperience() {
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({
        title: "",
        company: "",
        description: "",
      });
  }

  function removeExperience(exp) {
    if (exp && experience.includes(exp)) {
      setExperience(experience.filter((ex, i) => ex != exp));
    }
  }

  function handleProfileImage(e){
      let file = e.target.files[0]
      setBackendProfileImage(file)

      setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage(e){
    let file = e.target.files[0]
      setBackendCoverImage(file)

      setFrontendCoverImage(URL.createObjectURL(file))
  }
  

 const handleSaveProfile = async () => {
   setSavingProfile(true)
        try {
          let formData = new FormData()
          formData.append("firstName",firstName)
          formData.append("lastName",lastName)
          formData.append("userName",userName)
          formData.append("headline",headline)
          formData.append("location",location)
          formData.append("skills",JSON.stringify(skills))
          formData.append("experience",JSON.stringify(experience))
          if(backendProfileImage){
            formData.append("profileImage",backendProfileImage)
          }
          if(backendCoverImage){
            formData.append("coverImage",backendCoverImage)
          }

          let result = await axios.put(serverUrl + '/api/user/updateprofile',formData,{withCredentials:true})
          setUserData(result.data)
          setSavingProfile(false)
        } catch (error) {
          setSavingProfile(false)
          console.log(error)
        }
 }
   
let [savingProfile,setSavingProfile] = useState(false)
  
  return (
    <div className="w-full h-[100vh] flex justify-center items-center fixed top-0  z-[100]">

     {/* hidden inputs for image upload  */}
      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage}/>

      <div className="w-full h-[100vh] bg-black opacity-[0.6] absolute"></div>
      <div
        className="w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg
     absolute z-[200] rounded-lg px-3 py-4 overflow-auto "
      >
        <div
          className="absolute right-2 top-2 text-xl text-gray-700 cursor-pointer "
          onClick={() => setEdit(false)}
        >
          <RxCross2 />
        </div>

        <div className="w-full h-[130px] bg-gray-500 ronded-lg mt-3.5 rounded-md cursor-pointer overflow-hidden" onClick={()=>coverImage.current.click()}>
          <img src={frontendCoverImage} alt="" className="w-full" />
          <FiCamera className="absolute top-10 right-7 text-xl text-slate-100 " />
        </div>
        <div className="h-[60px] w-[60px] rounded-full overflow-hidden items-center justify-center absolute top-[130px] left-[30px] cursor-pointer" onClick={()=>profileImage.current.click()}>
          <img src={ frontendProfileImage} alt="" className=" w-[100%] h-[100%]" />
        </div>
        <div className="w-[20px] h-[20px] flex items-center justify-center bg-[#17c1ff] absolute top-40.5 left-18 rounded-full">
          <FaPlus className="text-[12px] text-white cursor-pointer" />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-2.5 mt-10">
          <input
            type="text"
            placeholder="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />
          <input
            type="text"
            placeholder="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />
          <input
            type="text"
            placeholder="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />
          <input
            type="text"
            placeholder="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />
          <input
            type="text"
            placeholder="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />
          <input
            type="text"
            placeholder="gender(male/female/other)"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-slate-100 w-full py-1.5 px-2.5 outline-none border-1 border-gray-500 rounded"
          />

          <div className="w-full p-[10px] bg-slate-100 border-1 border-gray-500 rounded">
            <h1 className="text-gray-700 font-semibold">Skills</h1>
            {skills  && (
              <div>
                {skills.map((skills, index) => (
                  <div
                    key={index}
                    className="text-gray-700 my-1 w-full bg-white py-1 px-2 rounded flex justify-between items-center"
                  >
                 {skills}
                    <RxCross2
                      className="cursor-pointer"
                      onClick={() => removeSkills(skills)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="add new skill"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="bg-white w-full py-1.5 px-2.5 my-2 outline-none border-1 border-gray-500 rounded"
              />
              <button
                className="bg-blue-500 px-7 py-1 rounded text-white cursor-pointer"
                onClick={addSkills}
              >
                Add
              </button>
            </div>
          </div>


          <div className="w-full p-[10px] bg-slate-100 border-1 border-gray-500 rounded">
            <h1 className="text-gray-700 font-semibold">Experience</h1>
            {experience && (
              <div >
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="text-gray-700 my-1 w-full bg-white py-1 px-2 rounded flex justify-between items-center"
                  >
                    <div className="p-1">
                      <p>Title: {exp.title}</p>
                      <p>Company: {exp.company}</p>
                      <p>Description: {exp.description}</p>
                    </div>
                    <RxCross2
                      className="cursor-pointer"
                      onClick={()=>removeExperience(exp)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="title"
                value={newExperience.title}
                onChange={(e) => setNewExperience({...newExperience,title:e.target.value})}
                className="bg-white w-full py-1.5 px-2.5 my-1 outline-none border-1 border-gray-500 rounded"
              />
              <input
                type="text"
                placeholder="company"
                value={newExperience.company}
                onChange={(e) => setNewExperience({...newExperience,company:e.target.value})}
                className="bg-white w-full py-1.5 px-2.5 my-1 outline-none border-1 border-gray-500 rounded"
              />
              <input
                type="text"
                placeholder="description"
                value={newExperience.description}
                onChange={(e) => setNewExperience({...newExperience,description:e.target.value})}
                className="bg-white w-full py-1.5 px-2.5 my-1 outline-none border-1 border-gray-500 rounded"
              />
              <button
                className="bg-blue-500 px-7 py-1 rounded text-white cursor-pointer mt-2"
                onClick={addExperience}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 mb-4 bg-blue-600 py-1 text-white rounded-full cursor-pointer hover:bg-blue-500 transition-all duration-500 ease-in-out" onClick={()=> handleSaveProfile()}>{savingProfile?'saving...':'Save Profile'}</button>
      </div>
    </div>
  );
}

export default EditProfile;
