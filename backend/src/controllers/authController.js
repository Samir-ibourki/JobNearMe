import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, city, role } = req.body;

  if (!fullName || !email || !password) {
    throw new AppError("Nom, email et mot de passe sont requis", 400);
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new AppError("Format email invalide", 400);
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new AppError("Cet email est déjà utilisé", 409);
  }

  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    city,
    role: role || "candidate",
  });

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: "Inscription réussie",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email et mot de passe requis", 400);
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  const token = generateToken(user.id);

  res.json({
    success: true,
    message: "Connexion réussie",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) throw new AppError("Utilisateur introuvable", 404);

  res.json({
    success: true,
    data: user,
  });
});
