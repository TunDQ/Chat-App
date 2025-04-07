import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json("Unauthorized, no token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json("Unauthorized, invalid token");
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json("Unauthorized, user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json("Token is not valid");
  }
};
