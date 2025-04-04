import User from "../models/User.js";
import bcrypt from "bcryptjs";
exports.SignUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json("Please fill all the fields");
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json("Password must be at least 6 characters long");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = User.findOne({ email });
    if (user) {
      return res.status(409).json("User already exists");
    }
    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();
    return res.status(201).json("User created successfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
