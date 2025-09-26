import {
  signUp,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", protectRoute, checkAuth);
router.put("/update-profile", protectRoute, updateProfile);
export default router;
