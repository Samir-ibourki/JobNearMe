import sequelize from "../config/database.js";
import Application from "./Application.js";
import Job from "./Job.js";
import User from "./User.js";

//associations
User.hasMany(Job, { foreignKey: "userId", as: "jobs" });
Job.belongsTo(User, { foreignKey: "userId", as: "employer" });

User.hasMany(Application, { foreignKey: "userId", as: "applications" });
Application.belongsTo(User, { foreignKey: "userId", as: "candidate" });

Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

export default {
  sequelize,
  User,
  Job,
  Application,
};
