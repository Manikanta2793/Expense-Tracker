import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.sub).select("_id name email");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export { authenticate };
