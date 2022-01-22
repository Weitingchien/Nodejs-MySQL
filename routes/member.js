const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const { validationRules, validation } = require('../models/validation');
let memberInstance = new MemberMethod();

// read
router.post(
  '/member',
  validationRules(),
  validation(),
  memberInstance.toRegister
);

router.post(
  '/member/login',
  validationRules(),
  validation(),
  memberInstance.toLogin
);

module.exports = router;
