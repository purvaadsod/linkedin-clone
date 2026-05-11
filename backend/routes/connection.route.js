import express, { Router } from "express";
import {
  acceptConnection,
  getConnectionRequest,
  getConnectionStatus,
  getUserConnections,
  rejectConnection,
  removeConnection,
  sendConnection,
} from "../controllers/connection.controller.js";
import isAuth from "../middleware/isAuth.js";

let connectionRouter = express(Router());

connectionRouter.post("/send/:id", isAuth, sendConnection);
connectionRouter.put("/accept/:connectionId", isAuth, acceptConnection);
connectionRouter.put("/reject/:connectionId", isAuth, rejectConnection);
connectionRouter.get("/getstatus/:userId", isAuth, getConnectionStatus);
connectionRouter.delete("/remove/:userId", isAuth, removeConnection);
connectionRouter.get("/request", isAuth, getConnectionRequest);
connectionRouter.get("/", isAuth, getUserConnections);

export default connectionRouter;
