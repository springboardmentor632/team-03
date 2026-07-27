const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const logger = require("./utils/logger");
const { errorHandler } = require("./utils/errors");

require("dotenv").config();

// Require JWT_SECRET env variable
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// CORS Whitelist origin matching
const whitelist = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Rate limiter: Max 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Request tracking logging middleware
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Swagger/OpenAPI setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "GovIntel Policy & Welfare Platform API",
      version: "1.0.0",
      description: "Secure API engine for government policies, welfare scheme matching, audit logs, and feedback tracking.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/app.js", "./src/modules/**/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Liveness and readiness endpoints; do not expose secrets.
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/ready", (req, res) => {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ status: "unavailable" });
  res.status(200).json({ status: "ready" });
});

// Import modules routes
const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const policiesRoutes = require("./modules/policies/policies.routes");
const schemesRoutes = require("./modules/schemes/schemes.routes");
const eligibilityRoutes = require("./modules/eligibility/eligibility.routes");
const notificationsRoutes = require("./modules/notifications/notifications.routes");
const feedbackRoutes = require("./modules/feedback/feedback.routes");
const reportsRoutes = require("./modules/reports/reports.routes");
const auditLogsRoutes = require("./modules/auditLogs/auditLogs.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const applicationsRoutes = require("./modules/applications/applications.routes");
const searchRoutes = require("./modules/search/search.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/policies", policiesRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/search", searchRoutes);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
