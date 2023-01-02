const express = require('express');
const router = express.Router();
const {
  createJogging,
  getJoggingById,
  deleteJoggingById,
  updateJoggingById,
  getAllJogging,
  deleteManyJogging,
  updateManyJogging,
} = require('../controller/jogging');
const { isLoggedIn } = require('../middleware/userValidation');
const {
  validateJogging,
  acceptIfAuthorizedForJogging,
  deleteManyIfValid,
  updateManyIfValid,
} = require('../middleware/jogging');

router.post(
  '/api/v1/createJogging',
  isLoggedIn,
  validateJogging,
  createJogging
);

router.get(
  '/api/v1/getJoggingById/:id',
  isLoggedIn,
  acceptIfAuthorizedForJogging,
  getJoggingById
);

router.delete(
  '/api/v1/deleteJoggingById/:id',
  isLoggedIn,
  acceptIfAuthorizedForJogging,
  deleteJoggingById
);

router.patch(
  '/api/v1/updateJoggingById/:id',
  isLoggedIn,
  acceptIfAuthorizedForJogging,
  validateJogging,
  updateJoggingById
);

router.get('/api/v1/getAllJogging', isLoggedIn, getAllJogging);

router.delete(
  '/api/v1/deleteManyJogging',
  isLoggedIn,
  deleteManyIfValid,
  deleteManyJogging
);

router.patch(
  '/api/v1/updateManyJogging',
  isLoggedIn,
  updateManyIfValid,
  updateManyJogging
);

module.exports = router;
