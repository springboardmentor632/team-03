const notificationsService = require("./notifications.service");

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user.id);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationsService.markAsRead(id, req.user.id);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
