import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// update profile will only run if user is authenticated,
//so that is the task of middleware protectRoute : auth.middleware.js
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth); // to get auth status from protectroute middleware

export default router; // we'll import it as authroute inside index.js
