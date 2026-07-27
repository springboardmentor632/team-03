const feedbackService = require("./feedback.service");
const { logAction } = require("../auditLogs/auditLogs.service");

const submitFeedback = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const feedback = await feedbackService.submitFeedback({
      ...req.body,
      userId,
    });

    await logAction({
      action: "FEEDBACK_SUBMIT",
      userId,
      userRole: req.user ? req.user.role : "guest",
      details: `Submitted contact/feedback: ${feedback.subject}`,
      targetId: feedback._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getFeedbacks();
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackService.resolveFeedback(id);

    await logAction({
      action: "FEEDBACK_RESOLVE",
      userId: req.user.id,
      userRole: req.user.role,
      details: `Resolved feedback item: ${feedback.subject}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Feedback marked as resolved", feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  resolveFeedback,
};
