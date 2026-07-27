const authService = require("./auth.service");
const { logAction } = require("../auditLogs/auditLogs.service");

const register = async (req, res) => {
  try {
    const { token, refreshToken, user } = await authService.registerUser(req.body);

    await logAction({
      action: "USER_REGISTER",
      userId: user._id,
      userRole: user.role,
      details: `Registered new user: ${user.email} as ${user.role}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, user } = await authService.loginUser(email, password);

    await logAction({
      action: "USER_LOGIN",
      userId: user._id,
      userRole: user.role,
      details: `Logged in user: ${user.email}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        savedPolicies: user.savedPolicies,
        savedSchemes: user.savedSchemes,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    // Remove password field
    user.password = undefined;
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user.id, req.body);

    await logAction({
      action: "USER_UPDATE_PROFILE",
      userId: updatedUser._id,
      userRole: updatedUser.role,
      details: `Updated profile details`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        savedPolicies: updatedUser.savedPolicies,
        savedSchemes: updatedUser.savedSchemes,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const reset = await authService.createPasswordReset(req.body.email);
    if (reset) await logAction({ action: "USER_FORGOT_PASSWORD_REQUEST", userId: reset.user._id, userRole: reset.user.role, details: "Requested password reset", ipAddress: req.ip });
    // A mail adapter should deliver reset.rawToken; never return it to the browser.
    res.status(202).json({ success: true, message: "If that account exists, reset instructions have been sent." });
  } catch (_) { res.status(202).json({ success: true, message: "If that account exists, reset instructions have been sent." }); }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await authService.resetPassword(token, newPassword);

    await logAction({
      action: "USER_RESET_PASSWORD",
      userId: user._id,
      userRole: user.role,
      details: `Reset password successfully`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refresh,
};
