import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/product.route.js";

dotenv.config();
const app = express();
app.use(express.json()); // TODO: Accept us to use JSON data in the body of the request
app.use("/", router);
app.listen(5000, () => {
  console.log(process.env.MONGO_URI);
  connectDB();
  console.log("Server started at http://localhost:5000");
});
