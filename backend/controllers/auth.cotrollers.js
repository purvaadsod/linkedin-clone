import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password } = req.body;

    let userEmail = await User.findOne({ email });
    if (userEmail)
      return res.status(400).json({ message: "Email already exist!!" });

    let userNameExist = await User.findOne({ userName });
    if (userNameExist)
      return res.status(400).json({ message: "userName already exist!!" });

    if(password.length < 8) return res.status(400).json({message:"Password must contain at least 8 characters!!"})

    let hasshedPassword = await bcryptjs.hash(password, 5);

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password:hasshedPassword,
    });

    let token = genToken(user._id)

    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:process.env.NODE_ENVIRONMENT === "production"
    })
    return res.status(201).json(user)

  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Sign Up error"})
  }
};


export const login = async (req,res)=>{
  try {
    let{email,password} = req.body 
    
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User does not exist!!" });

    const isMatch =await bcryptjs.compare(password,user.password)

    if(!isMatch){
      return res.status(400).json({message:"Incorrect password!!"})
    }

    let token = genToken(user._id)

    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:process.env.NODE_ENVIRONMENT === "production"
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"login error"})
  }
}

export const logout = async (req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"Logout successfully!!"})
  } catch (error) {
    return res.status(500).json({message:"Logout error!!"})
  }
}