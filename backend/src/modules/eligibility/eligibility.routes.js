const express = require("express");
const router = express.Router();
const { validateEligibilityBody, validateEligibilityQuery } = require("./eligibility.validation");
const { checkEligibility, checkMyEligibility } = require("./eligibility.controller");
const { protect } = require("../auth/auth.middleware");

// Public search query checker
router.post("/check", validateEligibilityBody, checkEligibility);

// Logged-in profile checker
router.get("/check-my", protect, checkMyEligibility);

module.exports = router;
