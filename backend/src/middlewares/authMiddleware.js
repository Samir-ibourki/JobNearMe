import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employer from "../models/Employer.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Acces refuse, Token manquant",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decode.type === "employer") {
      user = await Employer.findByPk(decode.id, {
        attributes: { exclude: ["password"] },
      });
    } else {
      user = await User.findByPk(decode.id, {
        attributes: { exclude: ["password"] },
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "utilisateur non trouvee",
      });
    }

    // Attach user and type to req
    req.user = user;
    req.userType = decode.type || "user";
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expire. Veuillez vous reconnecter",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Erreur d'authentification",
      error: error.message,
    });
  }
};
