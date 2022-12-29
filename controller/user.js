const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  deleteMany,
} = require('../database/models/user');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page) || 1,
    limit = 10;
  if (page <= 0) page = 1;

  const users = await getAllUsers(page, limit);

  if (!users.length) return next(new httpErrors(404, 'Users Not Found.'));

  res.status(200).json({ success: true, users });
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.params.userId);

  if (!user.length) return next(new httpErrors(404, 'User Not Found.'));

  res.status(200).json({ success: true, data: user });
});

exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await deleteUserById(req.params.userId);

  if (!user.length) return next(new httpErrors(404, 'User Not Found.'));

  res.status(200).json({ success: true, statusCode: 204, data: 'user' });
});

exports.updateUserById = asyncHandler(async (req, res, next) => {
  const user = await updateUserById(req.params.userId, req.user);

  if (!user.length) return next(new httpErrors(404, 'User Not Found.'));

  res.status(200).json({ success: true, data: user });
});

exports.deleteManyUsers = asyncHandler(async (req, res, next) => {
  const users = await deleteMany(req.body);

  let counter = 0;
  users.forEach((el) => {
    if (!el.length) counter++;
  });
  if (counter === 3) return next(new httpErrors(404, 'Not Found.'));

  res.status(200).json({ success: true, statusCode: 204, data: users });
});

exports.updateManyUsers = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});
