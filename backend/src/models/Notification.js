import sequilze from "../config/database.js";
import { DataTypes } from "sequelize";

const Notification = sequilze.define("Notification", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("user", "employer"),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      "new_application",
      "application_accepted",
      "application_rejected",
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
export default Notification;
