import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 9999;

app.use(express.json());
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
