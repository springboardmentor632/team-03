const validateEligibilityQuery = (req, res, next) => {
  const profile = req.body;
  if (!profile || Object.keys(profile).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Eligibility criteria query parameters profile is required",
    });
  }
  next();
};

const validateEligibilityBody = (req, res, next) => {
  const profile = req.body;
  if (!profile || typeof profile !== "object") {
    return res.status(400).json({ success: false, message: "Eligibility profile payload is required" });
  }
  const requiredFields = ["age", "gender", "income", "state", "occupation", "education", "category"];
  const missing = requiredFields.filter((f) => !(f in profile));
  if (missing.length) {
    return res
      .status(400)
      .json({ success: false, message: `Missing required fields: ${missing.join(", ")}` });
  }
  next();
};

module.exports = {
  validateEligibilityQuery,
  validateEligibilityBody,
};
