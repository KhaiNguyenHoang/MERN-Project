import { signUp, login, logout } from "../controllers/auth.controller.js";
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, async (req, res) => {});
export default router;
