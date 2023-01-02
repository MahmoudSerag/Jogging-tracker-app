const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const {
  addNewJogging,
  getJoggingById,
  deleteJoggingById,
  updateJoggingById,
  getAllJogging,
  bulkDelete,
  bulkUpdate,
} = require('../database/models/jogging');
const { decodeToken } = require('../middleware/decoder');

exports.createJogging = asyncHandler(async (req, res, next) => {
  const jogging = await addNewJogging(req.user);

  if (!jogging.length) return next(new httpErrors(404, 'Jogging Not Found.'));

  res.status(201).json({ success: true, data: jogging });
});

exports.getJoggingById = asyncHandler(async (req, res, next) => {
  const jogging = await getJoggingById(req.params.id);

  if (!jogging.length) return next(new httpErrors(404, 'Jogging Not Found.'));

  res.status(200).json({ success: true, data: jogging });
});

exports.deleteJoggingById = asyncHandler(async (req, res) => {
  const jogging = await deleteJoggingById(req.params.id);

  res.status(200).json({ success: true, statusCode: 204, data: jogging });
});

exports.updateJoggingById = asyncHandler(async (req, res, next) => {
  const jogging = await updateJoggingById(req.user, req.params.id);

  if (!jogging.length) return next(new httpErrors(404, 'Jogging Not Found.'));

  res.status(200).json({ success: true, jogging });
});

exports.getAllJogging = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page) || 1,
    limit = 10;
  if (page <= 0) page = 1;

  const decodedToken = await decodeToken(req, res, next);

  const jogging = await getAllJogging(decodedToken, page, limit);

  if (!jogging.length) return next(new httpErrors(404, 'Jogging Not Found.'));

  res.status(200).json({ success: true, data: jogging });
});

exports.deleteManyJogging = asyncHandler(async (req, res) => {
  const jogging = await bulkDelete(req.user);

  res.status(200).json({
    success: true,
    statusCode: 204,
    data: [
      {
        existedJogging: jogging.exist,
        length: jogging.exist.length,
        message: 'Deleted Ids.',
      },
      {
        notExistedJogging: jogging.notExist,
        length: jogging.notExist.length,
        message: `Not Deleted Ids.`,
      },
    ],
  });
});

exports.updateManyJogging = asyncHandler(async (req, res, next) => {
  const jogging = await bulkUpdate(req.user);

  if (!jogging.length) return next(new httpErrors(404, 'Not Found.'));

  res.status(200).json({ success: true, jogging });
});
