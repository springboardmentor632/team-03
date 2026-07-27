const mongoose = require('mongoose');
const fail = (res, message) => res.status(400).json({ success: false, message });
const text = (value, field, { required = false, max = 5000 } = {}) => {
  if ((value === undefined || value === null || value === '') && required) return `${field} is required`;
  if (value !== undefined && (typeof value !== 'string' || value.trim().length > max)) return `${field} is invalid`;
  return null;
};
const validatePolicyOrScheme = (req, res, next) => {
  const errors = [text(req.body.title, 'Title', { required: req.method === 'POST', max: 200 }), text(req.body.description, 'Description', { required: req.method === 'POST' }), text(req.body.category, 'Category', { required: req.method === 'POST', max: 80 }), text(req.body.department, 'Department', { required: req.method === 'POST', max: 120 })].filter(Boolean);
  if (req.body.status || req.body.createdBy || req.body.approvedBy) return fail(res, 'Workflow and ownership fields cannot be supplied by clients');
  if (errors.length) return fail(res, errors[0]); next();
};
const validateObjectId = (name) => (req, res, next) => mongoose.isValidObjectId(req.params[name]) ? next() : fail(res, 'Invalid identifier');
const validatePagination = (req, res, next) => { const { page, limit } = req.query; if ((page && (!Number.isInteger(+page) || +page < 1)) || (limit && (!Number.isInteger(+limit) || +limit < 1 || +limit > 100))) return fail(res, 'Pagination values are invalid'); next(); };
module.exports = { validatePolicyOrScheme, validateObjectId, validatePagination };
