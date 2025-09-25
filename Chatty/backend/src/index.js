import connectDB from "./lib/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5001;

app.use("/api/auth", authRoute);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
