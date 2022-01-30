const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const {
  loginValidationRules,
  registerValidationRules,
  validation
} = require('../models/validation');
const authorization = require('../models/authorization');
const role = require('../config/role');
let memberInstance = new MemberMethod();

// res.redirect()只有301, 302能轉址
const redirectBack = (req, res, next) => {
  res.redirect(302, '/');
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

router.get('/logout', authorization(role.Member), memberInstance.toLogout);

module.exports = router;
