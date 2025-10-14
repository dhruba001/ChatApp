import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  // next because after it ran it will go to next : updateprofile, check auth.route.js
  try {
    //* we're getting jwt from cookies, by using cookie parser, setup in index.js
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "unauthorised - no token provided : auth.middleware",
      });
    }
    //* when we are storing jwt, it actually holds our user id, see utils.js
    //* now we'll decode the value out of jwt, get the user id from token
    //* so that nobody can fake a token
    //* decoded holds 3 values, the values were given when we're making jwt token
    //* userid, JWT_SECRET, and expires in
    //* jwt resides inside browser cookie storage
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //* if decoded returns falsy value
    if (!decoded) {
      return res.status(401).json({ message: "unauthorized - invalid token" });
    }
    //* User.find.. will get the whole db entry, so it will have id, name, email, password, so
    //* to remove password, we will do - [minus sign] password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found : auth.middlewre" });
    }

    //*we're now putting the whole db entry for the respective user inside the req.user
    //* so if we need id, we can do req.user._id
    req.user = user;

    //* we will go the next i.e updateProfile, check auth.route /update-profile
    next();
  } catch (error) {
    console.log(
      "error in protectRoute middleware: auth.middleware",
      error.message
    );
  }
};
