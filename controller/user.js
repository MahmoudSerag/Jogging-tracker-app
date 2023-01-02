const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  bulkDelete,
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

exports.deleteManyUsers = asyncHandler(async (req, res) => {
  const users = await bulkDelete(req.user);

  res.status(200).json({
    success: true,
    statusCode: 204,
    data: [
      {
        existedUsers: users.exist,
        length: users.exist.length,
        message: 'Deleted users.',
      },
      {
        notExistedUsers: users.notExist,
        length: users.notExist.length,
        message: `Not Deleted users.`,
      },
    ],
  });
});

exports.updateManyUsers = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});
