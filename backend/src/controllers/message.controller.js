import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.body._id; // getting req.body from protectroute middleware
    const filteredUsers = await User.find({
      id: { $ne: loggedInUserId },
    }).select("-password"); // find loggedin users except the one currently logged in
    // denoted by $ne, so if the db has 4 users the crrent user will see other 3 excluding him/her
    res.status(200).json({ message: "users for sidebar" }, filteredUsers);
    //sending the list of users back to client
  } catch (error) {
    console.log("error in getting getUsersForSidebar", error.message);
    res.status(500).json({
      message: "server error : message.controller getusersforsidebar",
    });
  }
};
