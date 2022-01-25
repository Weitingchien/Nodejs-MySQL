const express = require('express');
const router = express.Router();
const MemberMethod = require('../controllers/index');
const authorization = require('../models/authorization');
const Role = require('../config/role');
let memberInstance = new MemberMethod();

// read
router.get('/admin/membersinfo', authorization, memberInstance.getInfo);

module.exports = router;
