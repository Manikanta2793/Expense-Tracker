import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const buildToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

const register = async (req, res) => {
  try {
    const { name = "", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashedPassword });

    const token = buildToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: serializeUser(user)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = buildToken(user._id);

    return res.json({
      success: true,
      data: {
        token,
        user: serializeUser(user)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
};

export { register, login };
