const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const authorization = require('../models/authorization');
const {
  updatedMemberInfoValidationRules,
  validation
} = require('../models/validation');
//const Role = require('../config/role');
let memberInstance = new MemberMethod();

// 生產環境
//router.get('/membersinfo', authorization, memberInstance.getInfo);

// 測試環境

//read
router.get('/membersinfo', authorization, memberInstance.getInfo);

// update
router.patch(
  '/membersinfo',
  authorization,
  updatedMemberInfoValidationRules(),
  validation,
  memberInstance.updateInfo
);

module.exports = router;
