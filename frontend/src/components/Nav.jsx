import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo1.svg";
import { IoMdSearch } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { HiUsers } from "react-icons/hi";
import { IoMdNotifications } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.png";
import { userDataContext } from "../context/UserContext.jsx"
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
  let [showProfilePopup, setShowProfilePopup] = useState(false); 
  let {userData,setUserData,handleGetProfile} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let navigate = useNavigate()
  let [searchInput,setSearchInput] = useState("")
  let [searchData,setSearchData] = useState([])


const handleLogout = async () => {
  try {
     let result = await axios.get(serverUrl+'/api/auth/logout',{withCredentials:true})
     console.log(result)
     setUserData(null)
     navigate("/login")
  } catch (error) {
    console.log(error)
  }
}


useEffect(()=>{
    handleSearch()
  
},[searchInput])

const handleSearch = async () => {
 try {
    let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
    setSearchData(result.data)
 } catch (error) {
  setSearchData([])
  console.log(error)
 } 
}


  return (
    <div className="w-[100vw] h-[80px] bg-white fixed top-0 shadow-lg flex md:justify-around justify-between items-center px-4 z-10 ">
      <div className="flex justify-center items-center gap-[10px] ">
        <div className="cursor-pointer" onClick={() => {setActiveSearch(false);navigate("/")}}>
          <img src={logo} alt="" className="h-[45px] sm:h-[55px]" />
        </div>
        {!activeSearch && (
          <div>
            <IoMdSearch
              className="text-[40px] text-gray-600 md:hidden bg-[#f5f3ec] p-2 rounded-full font-light shadow-md"
              onClick={() => setActiveSearch(true)}
            />
          </div>
        )}

        {searchData.length > 0 &&   <div className="absolute top-[90px] left-[0px] lg:left-[80px] min-h-[100px] w-[100vw] lg:w-[700px] max-w-[500px] bg-white shadow-lg flex flex-col gap-[20px] p-[20px] overflow-auto">
           {searchData.map((sea,i)=>(
            <div className="flex gap-1 items-center border-b-2 border-gray-200 p-[8px] hover:bg-gray-200 cursor-pointer duration-500" key={i} onClick={()=>handleGetProfile(sea.userName)}>
              <div className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden ">
              <img src={sea.profileImage || dp} alt="" className="h-[100%] w-[100%]" />
            </div>
            <p className=" capitalize text-gray-700">{sea.firstName} {sea.lastName}</p>
            </div>
           ))}
        </div>}
      



        <form
          className={` w-[80vw] md:w-[350px] h-[35px] bg-[#f5f3ec] justify-center md:flex items-center px-2 rounded-md ${
            !activeSearch ? "hidden" : "flex"
          }`}
        >
          <div>
            <IoMdSearch className="text-2xl text-gray-600 pr-1" />
          </div>
          <input
            type="text"
            className=" flex-grow-1 outline-none items-center"
            placeholder="Search users..."
            onChange={(e)=>setSearchInput(e.target.value)}
            value={searchInput}
          />
        </form>
        {activeSearch && (
          <div onClick={() => setActiveSearch(false)}>
            <RxCross1 className="text-xl cursor-pointer text-gray-700 " />
          </div>
        )}
      </div>

      <div
        className={`flex justify-center items-center gap-[20px] relative ${
          activeSearch ? "hidden" : ""
        }`}
      >
        {/* pop up message when we click on the profile  */}
        {showProfilePopup && <div className="w-[300px] h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col gap-5 items-center px-3 py-7 md:left-0 right-0">
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <div className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden ">
              <img src={userData.profileImage || dp} alt="" className="h-[100%] w-[100%]" />
            </div>
            <p className=" capitalize text-gray-700">{userData.firstName} {userData.lastName}</p>
            <button className="border-2 border-blue-300 w-full rounded-full py-1 text-blue-400 shadow-sm cursor-pointer" onClick={()=>{handleGetProfile(userData.userName)}}>View Profile</button>
          </div>
          <div className="border-1 border-gray-400 w-full"></div>
          <div className="w-full flex flex-col justify-center items-center gap-3" >
            <div className=" flex justify-center items-center " onClick={()=>navigate("/network")}>
              <HiUsers className="text-2xl text-gray-700 mr-1 " />
              <p className=" text-gray-700 ">My Networks</p>
            </div>
            <button className="border-2 border-red-300 w-full rounded-full py-1 text-red-300 shadow-sm cursor-pointer" onClick={()=> handleLogout()}>Sign Out</button>
          </div>
        </div>}
        

        <div className="sm:flex flex-col justify-center items-center hidden cursor-pointer" onClick={()=>navigate("/")}>
          <TiHome className="text-3xl md:text-2xl text-gray-700" />
          <p className="hidden md:block text-gray-700">Home</p>
        </div>
        <div className="sm:flex flex-col justify-center items-center hidden cursor-pointer" onClick={()=> navigate("/network")}>
          <HiUsers className="text-3xl md:text-2xl text-gray-700" />
          <p className="hidden md:block text-gray-700">Network</p>
        </div>
        <div className="flex flex-col justify-center items-center cursor-pointer" onClick={()=>navigate("/notification")}>
          <IoMdNotifications className="text-3xl md:text-2xl text-gray-700" />
          <p className="hidden md:block text-gray-700">Notification</p>
        </div>
        <div className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] rounded-full overflow-hidden cursor-pointer mr-2 " onClick={()=> setShowProfilePopup(!showProfilePopup)}>
          <img src={userData.profileImage || dp} alt="" className="w-[100%] h-[100%]" />
        </div>
      </div>
    </div>
  );
}

export default Nav;
