import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // user will have to login after 7 days
  });
  // generating token and then sending to user in cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // maximum age in milliseconds
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", // if not dev then it'll be true, for https
  });
  return token;
};
