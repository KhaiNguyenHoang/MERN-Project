import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;

const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ code: 401, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const check = await User.findById(decoded.id).select("-password");
    if (!check) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: "Unauthorized" });
  }
};

export default protectRoute;
