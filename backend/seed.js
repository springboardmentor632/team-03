const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/modules/users/users.model");
const Policy = require("./src/modules/policies/policies.model");
const Scheme = require("./src/modules/schemes/schemes.model");
const Notification = require("./src/modules/notifications/notifications.model");
const Feedback = require("./src/modules/feedback/feedback.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform";

const seedData = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Clearing existing collections...");

    await User.deleteMany({});
    await Policy.deleteMany({});
    await Scheme.deleteMany({});
    await Notification.deleteMany({});
    await Feedback.deleteMany({});

    console.log("Creating default users...");
    const defaultPassword = "Password123";

    const admin = await User.create({
      name: "GovIntel Administrator",
      email: "admin@govintel.gov",
      password: defaultPassword,
      role: "admin",
      profile: {},
    });

    const official = await User.create({
      name: "State Official",
      email: "official@govintel.gov",
      password: defaultPassword,
      role: "official",
      profile: {},
    });

    const citizen = await User.create({
      name: "Ramesh Kumar",
      email: "citizen@govintel.gov",
      password: defaultPassword,
      role: "citizen",
      profile: {
        age: 28,
        gender: "Male",
        income: 180000,
        occupation: "Farmer",
        education: "10th Pass",
        state: "Bihar",
        category: "General",
        disability: false,
      },
    });

    console.log("Creating sample policies...");
    const policy1 = await Policy.create({
      title: "National Digital Literacy Policy 2026",
      description: "A framework targeting standard internet literacy across rural schools, provisioning local community labs.",
      category: "Education",
      department: "Ministry of Education",
      state: "Bihar",
      status: "approved",
      benefits: "Free laptop distribution and internet access setups.",
      applicationProcess: "Online application submission through state student portal.",
      deadline: new Date("2026-12-31"),
      createdBy: official._id,
      approvedBy: admin._id,
    });

    const policy2 = await Policy.create({
      title: "State Green Hydrogen Initiative",
      description: "Promoting carbon-neutral energy production through sustainable state grants to local research units.",
      category: "Energy",
      department: "Ministry of Renewable Energy",
      state: "Global",
      status: "pending_approval",
      benefits: "50% subsidy on green energy plant components.",
      applicationProcess: "Proposal submission to the ministry evaluation board.",
      deadline: new Date("2026-09-30"),
      createdBy: official._id,
    });

    console.log("Creating sample schemes...");
    const scheme1 = await Scheme.create({
      title: "PM Agricultural Support Scheme (Kisan Nidhi)",
      description: "Direct annual financial assistance to active farmers with small and marginal land holdings.",
      category: "Agriculture",
      department: "Ministry of Agriculture",
      state: "All",
      status: "approved",
      eligibilityRules: {
        ageMin: 18,
        ageMax: 60,
        gender: "All",
        incomeMax: 200000,
        occupation: "Farmer",
        education: "All",
        state: "All",
        category: "All",
        disabilityRequired: false,
      },
      benefits: "Direct bank transfer of ₹6,000 annually in three equal installments.",
      applicationProcess: "Submit application with land records on the Kisan portal.",
      createdBy: official._id,
      approvedBy: admin._id,
    });

    const scheme2 = await Scheme.create({
      title: "State Youth Higher Education Scholarship",
      description: "Educational scholarship support for students pursuing technical and engineering degrees.",
      category: "Education",
      department: "Ministry of Education",
      state: "Bihar",
      status: "approved",
      eligibilityRules: {
        ageMin: 17,
        ageMax: 25,
        gender: "All",
        incomeMax: 250000,
        occupation: "All",
        education: "10th Pass",
        state: "Bihar",
        category: "All",
        disabilityRequired: false,
      },
      benefits: "100% tuition fee waiver and ₹2,000 monthly stipend.",
      applicationProcess: "Apply online with marksheets and state residence certificate.",
      createdBy: official._id,
      approvedBy: admin._id,
    });

    console.log("Creating sample notifications...");
    await Notification.create([
      {
        userId: citizen._id,
        title: "Welcome to GovIntel!",
        message: "Your profile has been created successfully. Explore welfare schemes you are eligible for today.",
        type: "system",
      },
      {
        userId: null, // global broadcast
        title: "New Policy Update",
        message: "The National Digital Literacy Policy 2026 has been approved.",
        type: "new_policy",
      },
    ]);

    console.log("Creating sample feedback...");
    await Feedback.create([
      {
        userId: citizen._id,
        name: citizen.name,
        email: citizen.email,
        subject: "Welfare Match Calculator Inquiry",
        message: "Can we get email notifications when new agriculture schemes matching my profile are launched?",
        type: "feedback",
        status: "open",
      },
    ]);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedData();
