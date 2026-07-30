import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { getAdminSocketId, io } from "../lib/socket.js";

// =======================
// SIGNUP
// =======================
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Safe admin email check
    const adminEmail = process.env.ADMIN_EMAIL
      ? process.env.ADMIN_EMAIL.toLowerCase()
      : "";

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      status:
        adminEmail && email.toLowerCase() === adminEmail
          ? "approved"
          : "pending",
    });

    await newUser.save();

    // Notify admin if online
    const adminSocketId = getAdminSocketId();

    if (adminSocketId) {
      io.to(adminSocketId).emit("newAccountRequest", {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account request submitted. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is waiting for admin approval",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message: "Your account request was rejected",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      status: user.status,
    });
  } catch (error) {
    console.log("Error in login controller:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =======================
// LOGOUT
// =======================
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =======================
// UPDATE PROFILE
// =======================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =======================
// CHECK AUTH
// =======================
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};