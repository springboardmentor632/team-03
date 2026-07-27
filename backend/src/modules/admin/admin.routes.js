const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("./admin.controller");
const { protect, authorize } = require("../auth/auth.middleware");

router.get("/settings", protect, authorize("admin"), getSettings);
router.put("/settings", protect, authorize("admin"), updateSettings);

module.exports = router;
