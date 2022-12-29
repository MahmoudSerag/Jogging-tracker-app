const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  deleteManyUsers,
  updateManyUsers,
} = require('../controller/user');
const {
  isLoggedIn,
  isAmin,
  acceptIfAuthorized,
  deleteIfValid,
  updateIfValid,
  deleteManyIfValid,
} = require('../middleware/userValidation');

router.get('/api/v1/getAllUsers', isLoggedIn, isAmin, getAllUsers);

router.get(
  '/api/v1/getUserById/:userId',
  isLoggedIn,
  acceptIfAuthorized,
  getUserById
);

router.delete(
  '/api/v1/deleteUserById/:userId',
  isLoggedIn,
  acceptIfAuthorized,
  deleteIfValid,
  deleteUserById
);

router.patch(
  '/api/v1/updateUserById/:userId',
  isLoggedIn,
  acceptIfAuthorized,
  updateIfValid,
  updateUserById
);

router.delete(
  '/api/v1/deleteManyUsers',
  isLoggedIn,
  isAmin,
  deleteManyIfValid,
  deleteManyUsers
);

router.patch('/api/v1/updateManyUsers', updateManyUsers);

module.exports = router;
