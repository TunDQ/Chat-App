import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json("Please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("Email already exists");
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json("Password must be at least 6 characters long");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, name, password: hashedPassword });
    if (newUser) {
      generateToken(newUser._id, res);

      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        profileImage: newUser.profileImage,
      });
    } else {
      return res.status(500).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
