const policiesService = require("./policies.service");
const { logAction } = require("../auditLogs/auditLogs.service");

const getPolicies = async (req, res) => {
  try {
    const policies = await policiesService.getPolicies(req.query, req.user);
    res.status(200).json({ success: true, policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await policiesService.getPolicyById(req.params.id, req.user);
    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPolicy = async (req, res) => {
  try {
    const policy = await policiesService.createPolicy(req.body, req.user.id);

    await logAction({
      action: "POLICY_CREATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Created policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, policy });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await policiesService.updatePolicy(id, req.body, req.user);

    await logAction({
      action: "POLICY_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Updated policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await policiesService.deletePolicy(id, req.user);

    await logAction({
      action: "POLICY_DELETE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Deleted policy: ${policy.title}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitPolicyForApproval = async (req, res) => {
  try {
    const policy = await policiesService.submitForApproval(req.params.id, req.user);

    await logAction({
      action: "POLICY_SUBMIT_APPROVAL",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Submitted policy for approval: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy submitted for approval", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approvePolicy = async (req, res) => {
  try {
    const policy = await policiesService.approvePolicy(req.params.id, req.user.id);

    await logAction({
      action: "POLICY_APPROVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Approved and published policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy approved and published", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectPolicy = async (req, res) => {
  try {
    const policy = await policiesService.rejectPolicy(req.params.id);

    await logAction({
      action: "POLICY_REJECT",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Rejected policy (sent back to draft): ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy rejected and returned to drafts", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const archivePolicy = async (req, res) => {
  try {
    const policy = await policiesService.archivePolicy(req.params.id);

    await logAction({
      action: "POLICY_ARCHIVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Archived policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy archived successfully", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  submitPolicyForApproval,
  approvePolicy,
  rejectPolicy,
  archivePolicy,
};
