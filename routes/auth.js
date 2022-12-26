const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controller/auth');
const {
  registerValidation,
  loginValidation,
  logoutValidation,
} = require('../middleware/auth');

router.post('/api/v1/register', registerValidation, register);

router.post('/api/v1/login', loginValidation, login);

router.post('/api/v1/logout', logoutValidation, logout);

module.exports = router;
