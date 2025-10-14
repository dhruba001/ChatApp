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
      generateToken(newUser._id, res); // calling this function for jwt token
      await newUser.save();
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
  res.send("logout route");
};
