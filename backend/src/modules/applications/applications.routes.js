const express = require("express");
const router = express.Router();
const { submitApplication, getApplications, updateApplicationStatus } = require("./applications.controller");
const { protect, authorize } = require("../auth/auth.middleware");

router.post("/", protect, submitApplication);
router.get("/", protect, getApplications);
router.put("/:id/status", protect, authorize("admin", "official"), updateApplicationStatus);

module.exports = router;
