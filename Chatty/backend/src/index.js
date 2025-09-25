import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectDB from "./lib/db.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(port, () => {
  connectDB();
  console.log(`Server started at http://localhost:${port}`);
});
