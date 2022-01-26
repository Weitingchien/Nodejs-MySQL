const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const {
  loginValidationRules,
  registerValidationRules,
  validation
} = require('../models/validation');
const authorization = require('../models/authorization');
let memberInstance = new MemberMethod();

// res.redirect()只有301, 302能轉址
const redirectBack = (req, res, next) => {
  res.redirect(301, '/');
};

// create
router.post(
  '/register',
  registerValidationRules(),
  validation,
  memberInstance.toRegister,
  redirectBack
);

router.post(
  '/login',
  loginValidationRules(),
  validation,
  memberInstance.toLogin,
  redirectBack
);

router.get('/logout', authorization, memberInstance.toLogout);

module.exports = router;
