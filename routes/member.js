const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const { validationRules, validation } = require('../models/validation');
const authorization = require('../models/authorization');
const path = require('path');
let memberInstance = new MemberMethod();

// res.redirect()只有301, 302能轉址
const redirectBack = (req, res, next) => {
  res.redirect(301, '/');
};

// create
router.post(
  '/member/register',
  validationRules(),
  validation,
  memberInstance.toRegister,
  redirectBack
);

// 只有get可以吃到res.render()
//router.get('/member/registerfailed', validationRules(), validation);

//router.get('/register/error', memberInstance.getError);

router.post('/member/login', memberInstance.toLogin, redirectBack);
router.get('/member/logout', authorization, memberInstance.toLogout);

module.exports = router;
