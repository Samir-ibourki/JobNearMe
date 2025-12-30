import Employer from "../models/Employer.js";
import { sequelize, Job } from "../models/index.js";
import bcrypt from "bcryptjs";

const seedData = async () => {
  try {
    const jobCount = await Job.count();
    if (jobCount > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    await sequelize.sync({ force: true });
    console.log("Database reset");

    const employer = await Employer.create({
      fullname: "Local Business Owner",
      email: "employer@jobnearme.com",
      password: await bcrypt.hash("password123", 10),
      phone: "+212612345678",
      city: "Casablanca",
      address: "Boulevard Mohammed V, Casablanca",
    });
    console.log("Employer created:", employer.email);

    const jobs = [
      {
        title: "Waiter / Waitress",
        description:
          "We are looking for a dynamic and friendly waiter/waitress for a popular café in the city center. No experience required, on-the-job training provided. Flexible shifts.",
        salary: "3500 - 4500 DH + tips",
        category: "Hospitality",
        city: "Casablanca",
        latitude: 33.5731,
        longitude: -7.5898,
        address: "Boulevard Mohammed V, Casablanca",
        employerId: employer.id,
      },
      {
        title: "Sales Associate",
        description:
          "Youth clothing store in Rabat is seeking an enthusiastic and smiling sales associate. Part-time available for students. Sales experience is a plus.",
        salary: "4000 DH + commissions",
        category: "Retail",
        city: "Rabat",
        latitude: 34.0209,
        longitude: -6.8416,
        address: "Avenue Mohammed V, Rabat",
        employerId: employer.id,
      },
      {
        title: "Kitchen Assistant",
        description:
          "Traditional Moroccan restaurant in Marrakech is looking for a passionate kitchen assistant. Great opportunity to learn from a professional chef!",
        salary: "4500 DH",
        category: "Hospitality",
        city: "Marrakech",
        latitude: 31.6295,
        longitude: -7.9811,
        address: "Jemaa el-Fna Square, Marrakech",
        employerId: employer.id,
      },
    ];

    await Job.bulkCreate(jobs);
    console.log("3 job offers added successfully!");

    console.log("Test Employer: employer@jobnearme.com / password123");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

export default seedData;
