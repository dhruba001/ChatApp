import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const router = express();

//api's will be declared here

router.get("/users", protectRoute, getUsersForSidebar);

export default router;
