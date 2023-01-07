const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  deleteManyUsers,
  updateManyUsers,
  addNewAdmin,
} = require('../controller/user');
const {
  isLoggedIn,
  isAdmin,
  acceptIfUserAuthorized,
  deleteIfValid,
  deleteManyIfValid,
} = require('../middleware/userValidation');
const { registerValidation } = require('../middleware/auth');

router.get('/api/v1/getAllUsers', isLoggedIn, isAdmin, getAllUsers);

router.get(
  '/api/v1/getUserById/:userId',
  isLoggedIn,
  acceptIfUserAuthorized,
  getUserById
);

router.delete(
  '/api/v1/deleteUserById/:userId',
  isLoggedIn,
  acceptIfUserAuthorized,
  deleteIfValid,
  deleteUserById
);

router.patch(
  '/api/v1/updateUserById/:userId',
  isLoggedIn,
  acceptIfUserAuthorized,
  registerValidation,
  updateUserById
);

router.delete(
  '/api/v1/deleteManyUsers',
  isLoggedIn,
  isAdmin,
  deleteManyIfValid,
  deleteManyUsers
);

router.post(
  '/api/v1/user/addAdmin/:userId',
  isLoggedIn,
  isAdmin,
  acceptIfUserAuthorized,
  addNewAdmin
);

router.patch('/api/v1/updateManyUsers', isLoggedIn, isAdmin, updateManyUsers);

module.exports = router;
