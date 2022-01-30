const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const authorization = require('../models/authorization');
const {
  updatedMemberInfoValidationRules,
  validation
} = require('../models/validation');
const role = require('../config/role');
let memberInstance = new MemberMethod();

//read
router.get('/membersinfo', authorization(role.Admin), memberInstance.getInfo);

// update
router.patch(
  '/membersinfo',
  authorization(role.Admin),
  updatedMemberInfoValidationRules(),
  validation,
  memberInstance.updateInfo
);

// delete
router.delete(
  '/membersinfo',
  authorization(role.Admin),
  memberInstance.deleteMemberInfo
);

module.exports = router;
