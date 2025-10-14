import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// update profile will only run if user is authenticated,
//so that is the task of middleware protectRoute : auth.middleware.js
router.put("/update-profile", protectRoute, updateProfile);

export default router;
