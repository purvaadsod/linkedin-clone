import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext.jsx"
import axios from "axios";

function SignUp() {
  let [showPass, setShowPass] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let {userData,setUserData} = useContext(userDataContext)

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [err, setErr] = useState("");
 

  const handleSignUp = async (e) => {
    setloading(true)
    try {
      e.preventDefault();
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          firstName,
          lastName,
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data)
      navigate("/")
      setErr("")
      setloading(false)
      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (error) {
  setloading(false);
  if (error.response && error.response.data && error.response.data.message) {
    setErr(error.response.data.message);
  } else {
    setErr("Something went wrong. Please try again.");
  }
}
  };

  return (
    <>
      <div className="w-full h-screen bg-white flex flex-col justify-start items-center gap-[10px]">
        <div className="lg:p-[30px] p-[20px] w-full h-[80px] flex items-center">
          <img src={logo} alt="" />
        </div>
        <form
          className="w-[90%] max-w-[400px] h-[520px] sm:shadow-xl flex flex-col justify-center gap-[10px] p-[20px] md:px-7 "
          onSubmit={(e) => handleSignUp(e)}
        >
          <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px] text-shadow-md">
            Sign Up
          </h1>
          <input
            type="text"
            placeholder="firstName"
            required
            className="w-[100%] h-[40px] border-2 border-gray-600 text-gray-800 text-[18px] outline-0 px-[20px] py-[10px] rounded-md"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="lastName"
            required
            className="w-[100%] h-[40px] border-2 border-gray-600 text-gray-800 text-[18px] outline-0 px-[20px] py-[10px] rounded-md"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="userName"
            required
            className="w-[100%] h-[40px] border-2 border-gray-600 text-gray-800 text-[18px] outline-0 px-[20px] py-[10px] rounded-md"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            required
            className="w-[100%] h-[40px] border-2 border-gray-600 text-gray-800 text-[18px] outline-0 px-[20px] py-[10px] rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-between  border-2 border-gray-600  items-center rounded-md">
            <input
              type={showPass ? "text" : "password"}
              placeholder="password"
              required
              className="w-[100%] h-[40px]  text-gray-800 text-[18px] outline-0 px-[20px] py-[10px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPass ? (
              <FaEyeSlash
                onClick={() => setShowPass(false)}
                className="mx-[10px] text-blue-900 text-shadow-xl cursor-pointer text-xl"
              />
            ) : (
              <FaEye
                onClick={() => setShowPass(true)}
                className="mx-[10px] text-blue-900 text-shadow-xl cursor-pointer text-xl"
              />
            )}
          </div>
          {err && <p className="text-center text-red-500 text-shadow-md">*{err}</p>}
          <button className="bg-blue-500 text-white py-1.5 rounded-full font-semibold text-shadow-md mt-[20px] cursor-pointer" disabled={loading}>
            {loading?'loading...':'Sign Up'}
          </button>
          <p className="text-center">
            Already have an account ?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default SignUp;
