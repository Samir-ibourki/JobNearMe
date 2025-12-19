import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { AppError } from "../middlewares/errorHandler.js";
import { Op } from "sequelize";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { role, fullname, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !fullname || !password) {
      throw new AppError("tous les champs sont requis", 400);
    }
    if (!emailRegex.test(email)) {
      throw new AppError("Email invalide", 400);
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }],
      },
    });

    if (existingUser) {
      throw new AppError(
        "Cet email ou nom d'utilisateur est déjà utilisé",
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: role || "candidate",
      fullname,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Utilisateur cree avec succes",
      data: {
        user: {
          id: user.id,
          role: user.role,
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
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "role", "fullname", "email", "password"],
    });
    if (!user) {
      throw new AppError("email or password incorrect", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          role: user.role,
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
  const userId = req.user.id;
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Utilisateur introuvable",
    });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
};

export { register, login, getProfile };
