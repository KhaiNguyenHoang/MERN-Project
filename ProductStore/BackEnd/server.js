import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/product.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json()); // TODO: Accept us to use JSON data in the body of the request
app.use("/", router);
app.listen(port, () => {
  console.log(process.env.MONGO_URI);
  connectDB();
  console.log(`Server started at http://localhost:${port}`);
});
