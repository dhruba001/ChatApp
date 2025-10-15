import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express();

//api's will be declared here

router.get("/users", protectRoute, getUsersForSidebar);

//* get messages for the users i am chatting with, so if say i chatted with 2 users
//* they will come as 2 disting chats, so clicking on each will fetch the chats for that users
//* only, and it will come when we send the user id
router.get("/:id", protectRoute, getMessages);

//* here this api is for sending message between authenticated users
//* message might be text or image
//* this api will be used by both sender, like me and the guy i am chatting with
//* both will use other one's id to send message test or image to one another
router.post("/send/:id", protectRoute, sendMessage);

export default router;
