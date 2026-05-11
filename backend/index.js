import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.route.js";
import connectionRouter from "./routes/connection.route.js";
import http from 'http'
import { Server } from 'socket.io';
import notificationRouter from "./routes/notification.route.js";

dotenv.config();

let app = express();

//socket.io
let server = http.createServer(app)
export const io = new Server(server,{
   cors:{
  origin:"http://localhost:5173",
  credentials:true
}
})


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

let port = process.env.PORT || 5000;
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

export const userSocketMap = new Map()

app.get("/", (req, res) => {
  res.send("Welcome");
});


io.on("connection",(socket)=>{

  socket.on("register",(userId)=>{
    userSocketMap.set(userId,socket.id)
    
  })
  socket.on("disconnect",(socket)=>{
    
  })
})



server.listen(port, () => {
  connectDB();
  console.log("server started...");
});
