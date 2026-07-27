const express = require("express");
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  submitSchemeForApproval,
  approveScheme,
  rejectScheme,
  archiveScheme,
  addSchemeUpdate,
} = require("./schemes.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");
const { validatePolicyOrScheme, validateObjectId, validatePagination } = require("../../utils/validation");

router.get("/", optionalProtect, validatePagination, getSchemes);
router.get("/:id", optionalProtect, validateObjectId("id"), getSchemeById);

// Official & Admin actions
router.post("/", protect, authorize("admin", "official"), validatePolicyOrScheme, createScheme);
router.put("/:id", protect, authorize("admin", "official"), validateObjectId("id"), validatePolicyOrScheme, updateScheme);
router.delete("/:id", protect, authorize("admin", "official"), validateObjectId("id"), deleteScheme);

// Workflow routing
router.put("/:id/submit", protect, authorize("admin", "official"), validateObjectId("id"), submitSchemeForApproval);
router.put("/:id/approve", protect, authorize("admin"), validateObjectId("id"), approveScheme);
router.put("/:id/reject", protect, authorize("admin"), validateObjectId("id"), rejectScheme);
router.put("/:id/archive", protect, authorize("admin"), validateObjectId("id"), archiveScheme);

// News/Updates logging
router.post("/:id/updates", protect, authorize("admin", "official"), addSchemeUpdate);

module.exports = router;
