import User from "../models/user.model.js";
import Message from "../models/message.model.js";

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

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // get the id of the guy i want to chat with
    const myId = req.user._id; // my id, getting from protectRoute

    const messages = await Message.find({
      //* find every message where i am sending it to the other guy
      //* and other guy sending to me
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res
      .status(200)
      .json({ message: "messages receiver : getmessage" }, messages);
  } catch (error) {
    console.log("error in getting getMessage controller ", error.message);
    res
      .status(500)
      .json({ error: "internal server error : getMessage controller" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body; // take out text and image from message
    const { id: receiverId } = req.params; // take id from req param [ heder] and save that value in receiver id
    const senderId = req.body._id; // save current loggedin user value into sender id

    let imageUrl; // declare an var for storing image url
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // we get secure url from cloudinary
    }
    // now send this data in message format
    const newMessage = new Message({
      receiverId,
      senderId,
      text,
      image: imageUrl,
    });

    /* 
save() → writes data to database
res → sends data to client (browser, frontend, API caller)
*/

    await newMessage.save(); //* this line saved data into mongoDB
    res.status(201).json(newMessage, { message: "data sent " }); //* this line just returns the data
  } catch (error) {
    console.log("error in sending message", error.message);
    res
      .status(500)
      .json({ error: "internal server error while sending message " });
  }
};
