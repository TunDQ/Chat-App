import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const isLoggedIn = req.user._id;
    const users = await User.find({ _id: { $ne: isLoggedIn } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
