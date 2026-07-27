const app = require("./app");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB successfully");
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    const shutdown = () => server.close(() => mongoose.connection.close().finally(() => process.exit(0)));
    process.once("SIGTERM", shutdown); process.once("SIGINT", shutdown);
  })
  .catch((err) => {
    logger.error("Database connection error: %O", err);
    process.exit(1);
  });
