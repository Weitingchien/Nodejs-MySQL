const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const { validationRules, validation } = require('../models/validation');
const authorization = require('../models/authorization');
let memberInstance = new MemberMethod();

// create
router.post(
  '/member',
  validationRules(),
  validation(),
  memberInstance.toRegister
);

// read
router.get('/member/info', authorization, memberInstance.getInfo);

router.post('/member/login', memberInstance.toLogin);
router.get('/member/logout', authorization, memberInstance.toLogout);

module.exports = router;
