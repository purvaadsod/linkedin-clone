import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import dp from "../assets/dp.png";

function Notification() {

  let {serverUrl} = useContext(authDataContext)
  let [notificationData,setNotificationData] = useState([])

const handleGetNotification = async () => {
  try {
    let result = await axios.get(serverUrl+"/api/notification/get",{withCredentials:true})
    setNotificationData(result.data)
  } catch (error) {
    console.log(error)
  }
}

const handleClearAllNotification = async () => {
  try {
    let result = await axios.get(serverUrl+"/api/notification",{withCredentials:true})
    await handleGetNotification()
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
  handleGetNotification()
,[]})


function handleMessage(type){
  if(type == "like") return "Liked your post!"
  else if(type == "comment") return "Commented on your post!"
  else return "Accepted connection request!"
}


  return (
    <>
      <Nav/>
    <div className='w-screen h-[100vh] overflow-auto bg-[#f5f3ec] pt-[100px] px-[20px]'>
      <div className='w-full h-[100px] bg-white  shadow-lg rounded-lg flex  justify-between items-center px-[10px]  text-[22px] text-gray-600'>
        <div> Notification {notificationData.length}</div>
        {notificationData.length > 0 && <button className=' border-2 text-red-500 border-red-600 px-3 lg:px-4 py-1 rounded-3xl hover:shadow-md cursor-pointer duration-700 text-[15px] sm:text-md' onClick={handleClearAllNotification}>Clear All</button>}
        
      </div>
      {notificationData.length > 0 && <div className='m-auto flex flex-col gap-5 my-5 w-[95vw] lg:max-w-[70vw]  rounded p-[15px]'>
        {notificationData.map((noti,idx)=>(
          <div className='flex justify-between gap-2 bg-white p-[10px] rounded-md' key={idx}>
          <div>
          <div className='flex  gap-1.5 items-center'>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer'>
               <img src={noti.relatedUser.profileImage || dp} alt="" className='w-full h-full' />
            </div>
          <div>{`${noti.relatedUser.firstName} ${noti.relatedUser.lastName}` }</div>
          </div>
          <div className='mt-1 mx-1.5 text-md text-gray-600 font-semibold text-shadow-md'>
            {handleMessage(noti.type)}
          </div>
          </div>
          <div className='w-[40%] lg:w-[20%] overflow-hidden'>
            {noti.relatedPost.image && <div><img src={noti.relatedPost.image} className='h-20 w-30'/></div>}
         <div className='w-[100%] overflow-hidden h-[30px]'>{noti.relatedPost.description}</div>
          </div>
          </div>
        ))}
      </div>}
      
    </div>
    </>
  )
}

export default Notification