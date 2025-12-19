import sequelize from "../config/database.js";
import Application from "./Application.js";
import Job from "./Job.js";
import User from "./User.js";

//associations
User.hasMany(Job, { foreignKey: "employerId", as: "postedJobs" });
Job.belongsTo(User, { foreignKey: "employerId", as: "employer" });

User.hasMany(Application, { foreignKey: "candidateId", as: "applications" });
Application.belongsTo(User, { foreignKey: "candidateId", as: "candidate" });

Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

export { sequelize, User, Job, Application };
