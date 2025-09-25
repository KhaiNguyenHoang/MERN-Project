// TODO: Import the necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/product.route.js";
import path from "path";

const __dirname = path.resolve();
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.use(express.static(__dirname + "/FrontEnd/dist"));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "FrontEnd/dist", "index.html"));
  });
}

app.use(express.json()); // TODO: Accept us to use JSON data in the body of the request
app.use(cors());
app.use("/", router);
app.listen(port, () => {
  console.log(process.env.MONGO_URI);
  connectDB();
  console.log(`Server started at http://localhost:${port}`);
});
