import User from "../models/users.model.js";

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "User found",
        user,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password, profilePic } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      if (fullName) {
        user.fullName = fullName;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      if (profilePic) {
        user.profilePic = profilePic;
      }
      await user.save();
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "User updated",
        user,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
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

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      await user.remove();
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "User deleted",
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
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
