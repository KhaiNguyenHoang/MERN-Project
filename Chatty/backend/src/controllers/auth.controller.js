import User from "../models/user.model.js";
import jwtUtils from "../lib/jwt.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ code: 400, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    return res.status(201).json({
      code: 201,
      message: "User created successfully",
      jwt: jwtUtils.generateToken(newUser, res),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: 500, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ code: 400, message: "Please provide all fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ code: 400, message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ code: 400, message: "Incorrect password" });

    const token = jwtUtils.generateToken(user, res);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res
      .status(200)
      .json({ code: 200, message: "Login successful", jwt: token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: 500, message: "Failed to login", err: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ code: 200, message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: 500, message: "Failed to logout", err: err.message });
  }
};
