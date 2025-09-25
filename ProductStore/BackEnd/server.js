import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/product.route.js";
import path from "path";
import { fileURLToPath } from "url";

// Chuyển __filename & __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Serve frontend build trong production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FrontEnd/dist")));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../FrontEnd/dist", "index.html"));
  });
}

app.use(express.json());
app.use(cors());
app.use("/", router);

connectDB();

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
