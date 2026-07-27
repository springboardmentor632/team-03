const schemesService = require("./schemes.service");
const { logAction } = require("../auditLogs/auditLogs.service");

const getSchemes = async (req, res) => {
  try {
    const schemes = await schemesService.getSchemes(req.query, req.user);
    res.status(200).json({ success: true, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSchemeById = async (req, res) => {
  try {
    const scheme = await schemesService.getSchemeById(req.params.id, req.user);
    res.status(200).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createScheme = async (req, res) => {
  try {
    const scheme = await schemesService.createScheme(req.body, req.user.id);

    await logAction({
      action: "SCHEME_CREATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Created scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await schemesService.updateScheme(id, req.body, req.user);

    await logAction({
      action: "SCHEME_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Updated scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    await schemesService.deleteScheme(id, req.user);

    await logAction({
      action: "SCHEME_DELETE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Deleted scheme`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitSchemeForApproval = async (req, res) => {
  try {
    const scheme = await schemesService.submitForApproval(req.params.id, req.user);

    await logAction({
      action: "SCHEME_SUBMIT_APPROVAL",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Submitted scheme for approval: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme submitted for approval", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveScheme = async (req, res) => {
  try {
    const scheme = await schemesService.approveScheme(req.params.id, req.user.id);

    await logAction({
      action: "SCHEME_APPROVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Approved scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme approved and published", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectScheme = async (req, res) => {
  try {
    const scheme = await schemesService.rejectScheme(req.params.id);

    await logAction({
      action: "SCHEME_REJECT",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Rejected scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme returned to drafts", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const archiveScheme = async (req, res) => {
  try {
    const scheme = await schemesService.archiveScheme(req.params.id);

    await logAction({
      action: "SCHEME_ARCHIVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Archived scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme archived successfully", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addSchemeUpdate = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "Update content is required" });

    const scheme = await schemesService.addSchemeUpdate(req.params.id, content);

    await logAction({
      action: "SCHEME_ADD_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Added updates to scheme ${scheme.title}: ${content}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme update posted", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
