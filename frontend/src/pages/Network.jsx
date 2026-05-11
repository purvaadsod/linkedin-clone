import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'

function Network() {

  let {serverUrl} = useContext(authDataContext)
  let [connection,setConnection] = useState([])
 const handleGetRequest = async ()=>{
  try {
    let result =  await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
    setConnection(result.data)
  } catch (error) {
    console.log(error)
  }
 }
 
useEffect(()=>{
  handleGetRequest()
})

  return (
    <>
      <Nav/>
    <div className='w-screen h-[100vh] bg-[#f5f3ec] pt-[100px] px-[20px]'>
      <div className='w-full h-[100px] bg-white  shadow-lg rounded-lg flex items-center px-[10px]  text-[22px] text-gray-600'>
         Invitations {connection.length}
      </div>
      <div>
        {connection.map((cn,idx)=>(
          <div>{connection.sender.firstName}</div>
        ))}
      </div>
    </div>
    </>
  )
}

export default Network