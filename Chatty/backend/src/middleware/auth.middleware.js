import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const secret = process.env.JWT_SECRET;
//
// const protectRoute = async (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (!token) {
//     return res.status(401).json({ code: 401, message: "Unauthorized" });
//   }
//
//   try {
//     const decoded = jwt.verify(token, secret);
//     const check = await User.findById(decoded.id).select("-password");
//     if (!check) {
//       return res.status(401).json({ code: 401, message: "Unauthorized" });
//     }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ code: 401, message: "Unauthorized" });
//   }
// };
//
//
export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    // fallback nếu không có cookie thì lấy từ Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default protectRoute;
