import bcrypt from "bcryptjs";
import User from "../models/users.model.js";
import generateJwtToken from "../lib/utils.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, profilePic } = req.body;

    if (!fullName || !email || !password || !profilePic) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Please provide all the required fields",
        fieldsMissing: ["fullName", "email", "password", "profilePic"].filter(
          (field) => !req.body[field],
        ),
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      const jwtToken = generateJwtToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        code: 201,
        status: "success",
        message: "User created successfully",
        jwtToken,
      });
    } else {
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Please provide all the required fields",
        fieldsMissing: ["email", "password"],
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (isPasswordCorrect) {
          const token = generateJwtToken(existingUser._id, res);
          return res.status(200).json({
            code: 200,
            status: "success",
            message: "Login successful",
            jwtToken: token,
          });
        } else {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: "Incorrect password",
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Server error",
    });
  }
};
