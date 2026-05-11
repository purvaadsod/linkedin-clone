import React, { useState } from "react";
import dp from "../assets/dp.png";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import axios from "axios";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import { useEffect } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import {io} from 'socket.io-client'
import ConnectionButton from "./ConnectionButton.jsx";
// moment package for getting how time before post created

let socket = io("http://localhost:8000")

function Post({ id, author, like, comment, description, image, createdAt }) {
  let { serverUrl } = useContext(authDataContext);
  let { userData,getPost,handleGetProfile } = useContext(userDataContext);
  let [likes, setLikes] = useState(like || []);
  let [comments, setcomments] = useState(comment || []);
  let [commentContent,setCommentContent] = useState("")

  let [showComment,setShowComment] = useState(false)


  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`,{content:commentContent}, {
        withCredentials: true,
      });
      setcomments(result.data.comment);
      setCommentContent("")
    } catch (error) {
      console.log(error);
    }
  };

 useEffect(()=>{
  socket.on("likeUpdated",({postId,likes})=>{
    if(postId == id){
       setLikes(likes)
    }
  })

  socket.on("commentAdded",({postId,comment})=>{
    if(postId == id){
       setcomments(comment)
    }
  })

  return () =>{
    socket.off("likeUpdated")
    socket.off("commentAdded")
  }
 },[id])

useEffect(()=>{
   getPost()
},[likes,setLikes,comments,setcomments])

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow-lg p-[20px] flex flex-col gap-[20px]">
      <div className="flex justify-between items- cursor-pointer"  >
        <div className="flex gap-2 items-start justify-center"
        onClick={()=>handleGetProfile(author.userName)}>
          <div className="h-[60px] w-[60px] rounded-full overflow-hidden  flex items-center justify-center  left-[30px] cursor-pointer border-1">
            <img
              src={author.profileImage || dp}
              alt=""
              className="h-full"
            />
          </div>
          <div className="flex flex-col justify-center ">
            <p className="text-[18px] text-gray-700 font-semibold">{`${author.firstName} ${author.lastName}`}</p>
            <p className="text-gray-700 text-[14px]">{author.headline}</p>
            <p className="text-gray-500">{moment(createdAt).fromNow()}</p>
          </div>
        </div>
        {userData._id != author._id && <div><ConnectionButton userId={author._id}/></div>}
        
      </div>

      <div className="w-full max-h-[200px] overflow-auto">{description}</div>

      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}

      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500">
          <div className="flex items-center justify-center gap-[5px] text-[18px]">
            <BiLike className="text-[#1ebbff] w-[20px] h-[20px]" />
            <span>{like.length}</span>
          </div>
          <div className="flex items-center justify-center gap-[5px]">
            <span>{comment.length}</span>
            <span>Comments</span>
          </div>
        </div>
        <div className="w-full flex gap-[25px] items-center px-[20px] py-[10px]">

          {!likes.includes(userData._id)  && <div
            className="flex justify-center items-center gap-1 text-gray-700 text-md cursor-pointer"
            onClick={() => {
              handleLike();
            }}
          >
              <BiLike className="w-[20px] h-[20px]" />

            <span>Like</span>
          </div>}
          
           {likes.includes(userData._id)  && <div
            className="flex justify-center items-center gap-1 text-gray-700 text-md cursor-pointer"
            onClick={() => {
              handleLike();
            }}
          >
              <BiSolidLike className="w-[20px] h-[20px]" />

            <span>Liked</span>
          </div>}
          <div className="flex justify-center items-center gap-1 text-gray-700 cursor-pointer text-md" onClick={()=>setShowComment(!showComment)}>
            <FaRegCommentDots />
            <span>Comment</span>
          </div>
        </div>
       
       {showComment && <div>
         <form className="w-full flex justify-between items-center border-b-gray-300 border-b-2 p-[10px]" onSubmit={(e)=>handleComment(e)}>
          <input type="text" placeholder="leave a comment..."  className="outline-none border-none w-[90%]" value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
          <button><LuSendHorizontal  className="text-xl text-gray-700 cursor-pointer"/></button>
        </form>
        <div className="flex flex-col gap-[10px] ">
          {comments.map((com)=>(
            <div className="flex flex-col gap-[5px] border-b-2 border-gray-200 p-[15px]">
              <div className="w-full flex justify-start items-center gap-1.5">
                 <div className="h-[40px] w-[40px] rounded-full overflow-hidden  flex items-center justify-center  left-[30px] cursor-pointer border-1">
            <img
              src={com.user.profileImage || dp}
              alt=""
              className="h-full"
            />
          </div>
          <p className="text-[16px] text-gray-700 font-semibold">{`${com.user.firstName} ${com.user.lastName}`}</p>
              </div>
              <div className="pl-[35px]">
                {com.content}
              </div>
            </div>
          ))}
        </div></div>}
      </div>
    </div>
  );
}

export default Post;
