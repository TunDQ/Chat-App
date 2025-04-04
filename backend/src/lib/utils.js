import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    maxAge: 60 * 60 * 24 * 7 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
  });
  return token;
};
