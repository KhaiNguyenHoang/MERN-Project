import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (!mongoose.connection.db) {
      console.log("Error connecting to MongoDB");
      return false;
    } else {
      console.log("Connected to MongoDB");
      return true;
    }
  } catch (err) {
    console.log("Error connecting to MongoDB");
    return false;
  }
};

export default connectDB;
