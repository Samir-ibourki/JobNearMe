import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Application = sequelize.define("Application", {
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
export default Application;
