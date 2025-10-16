import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res
        .status(400)
        .json({ message: "All fields are required, some fields are empty" });
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exist in db, LogIn instead" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      //* fullname and email are same as we got from req.body only password is changed
      fullName,
      email,
      password: hashedPassword,
    }); // not sending profile pic here, as it has default value ""

    if (newUser) {
      generateToken(newUser._id, res); // calling this function for jwt token, it's attached to cookies
      await newUser.save(); // save it in db
      res
        .status(201) // all ok, so send all these data
        .json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
    } else {
      res
        .status(400)
        .json({ message: "Invalid user data or something went wrong" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(400).json({
      message: "Internal server error from authcontroller: signup",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Inavlid credentials : email" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Inavlid credentials : password" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "user authenticated and jwt generated ",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(400).json({
      message: "Internal server error from authcontroller: login",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // removeing jwt token from cookies
    res.status(200).json({ message: "Logout Successfull " });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res
      .status(500)
      .json({ message: "internal server error while logging out" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // we will get the photo from user

    // auth.middleware sent this -> req.user = user; so req.user has all of user data who's logged in currently
    const userId = req.user._id;
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "profile pic is required : auth.controller" });
    }
    // we will get a response with the secure url after upload is finished
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId, // to find the appropiate user
      {
        profilePic: uploadResponse.secure_url, // put the url in db under profilepic
      },
      { new: true } // now updatedUser will have the new user object, with new profilepic value, and other will stay same
    );

    res.status(200).json(updatedUser); // updated user has the latest value
  } catch (error) {
    console.log("error in update profile:", error);
    res
      .status(500)
      .json({ message: "internal server error : auth.controller" });
  }
};

export const checkAuth = (req, res) => {
  //it will give us the authenticated user details, excluding password
  //if any time app is refreshed we will check if user is still authenticated
  //if yes keep loggedin or else send user to log in page
  try {
    res.status(200).json(req.user); // send user [ req.user] back to client, except password
  } catch (error) {
    console.log("error in checkauth controller", error.message);
    res.status(500).json({ message: "internal server error : checkauth" });
  }
};
