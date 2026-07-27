const express = require("express");
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  submitPolicyForApproval,
  approvePolicy,
  rejectPolicy,
  archivePolicy,
} = require("./policies.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");
const { validatePolicyOrScheme, validateObjectId, validatePagination } = require("../../utils/validation");

router.get("/", optionalProtect, validatePagination, getPolicies);
router.get("/:id", optionalProtect, validateObjectId("id"), getPolicyById);

// Official & Admin policy actions
router.post("/", protect, authorize("admin", "official"), validatePolicyOrScheme, createPolicy);
router.put("/:id", protect, authorize("admin", "official"), validateObjectId("id"), validatePolicyOrScheme, updatePolicy);
router.delete("/:id", protect, authorize("admin", "official"), validateObjectId("id"), deletePolicy);

// Workflow routing
router.put("/:id/submit", protect, authorize("admin", "official"), validateObjectId("id"), submitPolicyForApproval);
router.put("/:id/approve", protect, authorize("admin"), validateObjectId("id"), approvePolicy);
router.put("/:id/reject", protect, authorize("admin"), validateObjectId("id"), rejectPolicy);
router.put("/:id/archive", protect, authorize("admin"), validateObjectId("id"), archivePolicy);

module.exports = router;
