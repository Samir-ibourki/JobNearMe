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
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Jobs", key: "id" },
  },
});
export default Application;
