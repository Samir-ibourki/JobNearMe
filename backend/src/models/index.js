import sequelize from "../config/database.js";
import Application from "./Application.js";
import Job from "./Job.js";
import User from "./User.js";
import Employer from "./Employer.js";
import Notification from "./Notification.js";
//associations
//job posted by employer
Employer.hasMany(Job, { foreignKey: "employerId", as: "postedJobs" });
Job.belongsTo(Employer, { foreignKey: "employerId", as: "employer" });

//cadidate applications
User.hasMany(Application, { foreignKey: "candidateId", as: "applications" });
Application.belongsTo(User, { foreignKey: "candidateId", as: "candidate" });

//job applicat
Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

export { sequelize, User, Job, Application, Notification };
