import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // for getting jwt from cookie
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT;

//middlewares
app.use(express.json()); // now in anywhere we can get data from req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server is running on localhost://" + PORT);
  connectDB();
});
