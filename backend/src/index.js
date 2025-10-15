import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // for getting jwt from cookie
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

const app = express();

dotenv.config();
const PORT = process.env.PORT;

//middlewares
app.use(express.json()); // now in anywhere we can get data from req.body
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173/", credentials: true }));

/*
app.use("/api/auth", authRoutes); sets a base path for all routes defined inside authRoutes.

So for example, if inside auth.route.js we have:

router.post("/signup", signup);
router.post("/login", login);

Then the actual endpoints become: POST /api/auth/signup , POST /api/auth/login

Express automatically appends the paths from the router to the base path defined in app.use().
*/

//api routing paths : authroutes is auth.route.js
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("server is running on localhost://" + PORT);
  connectDB();
});
