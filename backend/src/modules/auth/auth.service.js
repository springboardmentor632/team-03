const authRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const safeUser = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile, savedPolicies: user.savedPolicies, savedSchemes: user.savedSchemes });
class AuthService {
  generateToken(id) { return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); }
  generateRefreshToken(id) { return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); }
  async issueTokens(user) {
    const token = this.generateToken(user._id); const refreshToken = this.generateRefreshToken(user._id);
    user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex'); await user.save();
    return { token, refreshToken, user: safeUser(user) };
  }
  async registerUser({ name, email, password, profile = {} }) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await authRepository.findByEmail(normalizedEmail)) throw new Error('An account with this email already exists');
    const user = await authRepository.createUser({ name: String(name).trim(), email: normalizedEmail, password, role: 'citizen', profile });
    return this.issueTokens(user);
  }
  async loginUser(email, password) {
    const user = await authRepository.findByEmail(String(email).trim().toLowerCase());
    if (!user || !user.isActive || !(await user.comparePassword(password))) throw new Error('Invalid email or password');
    return this.issueTokens(user);
  }
  async getUserProfile(id) { const user = await authRepository.findById(id); if (!user) throw new Error('User not found'); return safeUser(user); }
  async updateUserProfile(id, { name, profile }) {
    const user = await authRepository.findById(id); if (!user) throw new Error('User not found');
    if (name) user.name = String(name).trim(); if (profile) user.profile = { ...user.profile.toObject(), ...profile }; await user.save(); return user;
  }
  async createPasswordReset(email) {
    const user = await authRepository.findByEmail(String(email).trim().toLowerCase()); if (!user) return null;
    const rawToken = crypto.randomBytes(32).toString('hex'); user.passwordResetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex'); user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); await user.save();
    return { user, rawToken };
  }
  async resetPassword(token, newPassword) {
    const hash = crypto.createHash('sha256').update(token).digest('hex'); const User = require('../users/users.model');
    const user = await User.findOne({ passwordResetTokenHash: hash, passwordResetExpiresAt: { $gt: new Date() } }); if (!user) throw new Error('Reset link is invalid or expired');
    user.password = newPassword; user.passwordResetTokenHash = null; user.passwordResetExpiresAt = null; user.refreshToken = ''; await user.save(); return user;
  }
  async refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); const user = await authRepository.findById(decoded.id);
    if (!user || user.refreshToken !== crypto.createHash('sha256').update(refreshToken).digest('hex')) throw new Error('Invalid refresh token'); return this.issueTokens(user);
  }
}
module.exports = new AuthService();
