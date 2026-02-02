import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Employer from "../models/Employer.js";
import { AppError } from "../middlewares/errorHandler.js";
import { Op } from "sequelize";
import { sendEmail } from "../utils/emailService.js";
import crypto from "crypto";

const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { role, fullname, email, password, phone, city, address } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !fullname || !password) {
      throw new AppError("All fields are required", 400);
    }
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    let type = "user";

    if (role === "employer") {
      const existingEmployer = await Employer.findOne({
        where: { email },
      });
      if (existingEmployer) {
        throw new AppError("This email is already used by an employer", 409);
      }

      user = await Employer.create({
        fullname,
        email,
        password: hashedPassword,
        phone,
        city,
        address,
      });
      type = "employer";
    } else {
      //default to candidate
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new AppError("This email is already used", 409);
      }

      user = await User.create({
        role: "candidate",
        fullname,
        email,
        password: hashedPassword,
        phone,
      });
      type = "user";
    }

    const token = generateToken(user.id, type);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          role: role === "employer" ? "employer" : user.role,
          fullname: user.fullname,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }


    let user = await User.findOne({ where: { email } });
    let type = "user";

    if (!user) {
      user = await Employer.findOne({ where: { email } });
      type = "employer";
    }

    if (!user) {
      throw new AppError("Incorrect email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = generateToken(user.id, type);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          role: type === "employer" ? "employer" : user.role,
          fullname: user.fullname,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  // req.user is set by authMiddleware
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const responseData = user.toJSON();
  if (!responseData.role && req.userType === "employer") {
    responseData.role = "employer";
  }

  res.status(200).json({
    success: true,
    data: responseData,
  });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check both tables
    let user = await User.findOne({ where: { email } });
    let type = "user";

    if (!user) {
      user = await Employer.findOne({ where: { email } });
      type = "employer";
    }

    if (!user) {
      throw new AppError("User not found with this email", 404);
    }

    // Generate Secure Random Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Create Reset Link (Deep Link scheme for mobile app)
    const resetLink = `jobnearme://resetPassword?token=${resetToken}`;

    const message = `You requested a password reset. Please click the link below to set a new password:\n\n${resetLink}\n\nThis link expires in 1 hour.`;

    const htmlMessage = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Please click the button below to set a new password:</p>
      <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>Or click this link: <a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 1 hour.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - JobNearMe",
        text: message,
        html: htmlMessage,
      });

      res.status(200).json({
        success: true,
        message: "Reset link sent to email (Check Console for link)",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      throw new AppError("Error sending email", 500);
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Token can come from URL params (POST /reset-password/:token) or body
    const token = req.params.token || req.body.token;
    const { newPassword } = req.body;

    if (!token) {
      throw new AppError("Token is missing", 400);
    }

    // ttry in User
    let user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      //try in Employer
      user = await Employer.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });
    }

    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { fullname, phone } = req.body;

    // Update allowed fields
    if (fullname !== undefined) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Return updated user without password
    const responseData = user.toJSON();
    delete responseData.password;

    if (!responseData.role && req.userType === "employer") {
      responseData.role = "employer";
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
export {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  updateProfile,
};
