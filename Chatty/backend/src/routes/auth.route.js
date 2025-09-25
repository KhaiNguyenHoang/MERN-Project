import express from "express";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", (req, res) => {});
router.get("/logout", (req, res) => {});
export default router;
