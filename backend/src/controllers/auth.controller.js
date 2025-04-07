import cloudinary from "../lib/cloudinary.js";
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

      const data = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        profileImage: newUser.profileImage,
      };
      return res.status(201).json({
        message: "User created successfully",
        user: data,
      });
    } else {
      return res.status(500).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await User.findOne({ email });
    if (!users) {
      return res.status(400).json("Email or password is incorrect");
    }
    const isPasswordCorrect = await bcrypt.compare(password, users.password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Email or password is incorrect");
    }
    generateToken(users._id, res);

    const data = {
      _id: users._id,
      email: users.email,
      name: users.name,
      profileImage: users.profileImage,
    };
    return res.status(200).json({
      message: "Login successful",
      user: data,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const Logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { MaxAge: 0 });
    return res.status(200).json("Logout successful");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(400).json("Profile image is required");
    }

    const uploadResponse = await cloudinary.uploader.upload(profileImage);
    const uploaderUser = await User.findByIdAndUpdate(
      res.user._id,
      {
        profileImage: uploadResponse.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Profile image updated successfully",
      user: uploaderUser,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
