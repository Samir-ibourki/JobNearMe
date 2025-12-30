import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { AppError } from "../middlewares/errorHandler.js";
import { Op } from "sequelize";
import Employer from "../models/Employer.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { role, fullname, email, password, phone, city, address } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !fullname || !password) {
      throw new AppError("tous les champs sont requis", 400);
    }
    if (!emailRegex.test(email)) {
      throw new AppError("Email invalide", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    let type = "user";

    if (role === "employer") {
      // Check existing in Employer
      const existingEmployer = await Employer.findOne({
        where: { email },
      });
      if (existingEmployer) {
        throw new AppError("Cet email est déjà utilisé par un employeur", 409);
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
      // Default to User (Candidate)
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new AppError("Cet email est déjà utilisé", 409);
      }

      user = await User.create({
        role: "candidate",
        fullname,
        email,
        password: hashedPassword,
      });
      type = "user";
    }

    const token = generateToken(user.id, type);

    res.status(201).json({
      success: true,
      message: "Utilisateur cree avec succes",
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
      throw new AppError("Email et mot de passe requis", 400);
    }

    let user = await User.findOne({ where: { email } });
    let type = "user";

    if (!user) {
      user = await Employer.findOne({ where: { email } });
      type = "employer";
    }

    if (!user) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const token = generateToken(user.id, type);
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
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
      message: "Utilisateur introuvable",
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

export { register, login, getProfile };
