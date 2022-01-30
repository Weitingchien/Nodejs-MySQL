const register = require('../models/register');
const login = require('../models/login');
const info = require('../models/info');
const encryption = require('../models/encryption');
const path = require('path');

class Member {
  toRegister(req, res, next) {
    const { username, email, password } = req.body;
    const encryptPassword = encryption(password);
    const memberData = {
      username: username,
      email: email,
      password: encryptPassword
    };
    register(memberData)
      .then(result => {
        next();
      })
      .catch(err => {
        console.log(err);
        next();
      });
  }

  toLogin(req, res, next) {
    const { email, password } = req.body;
    const encryptPassword = encryption(password);
    const memberData = {
      email: email,
      password: encryptPassword
    };
    login(memberData, req, res, next)
      .then(result => {
        console.log('登入成功!');
        return next();
      })
      .catch(err => {
        console.log('登入失敗!');
        return res
          .status(401)
          .render(path.join(__dirname, '../views/index.ejs'), {
            currentPage: 'Login',
            errorLoginMessage: '登入失敗，找不到此使用者',
            userID: false,
            errEmail: [],
            errPassword: []
          });
      });
  }

  toLogout(req, res, next) {
    req.session.userId = null;
    return res.redirect('/');
  }

  getInfo(req, res, next) {
    let status = 'get';
    info(req, res, status)
      .then(result => {
        console.log('成功獲取所有成員資訊');
      })
      .catch(err => {
        console.log('獲取失敗!');
      });
  }
  updateInfo(req, res, next) {
    console.log('updateMemberInfo');
    let status = 'update';
    info(req, res, status)
      .then(result => {
        console.log('成功更新成員資訊');
        return res.status(200).send({ result: result });
      })
      .catch(err => {
        console.log('更新失敗!');
        res.status(500).send({ message: err.message });
      });
  }
  deleteMemberInfo(req, res, next) {
    let status = 'delete';
    info(req, res, status)
      .then(result => {
        console.log('成功刪除成員');
        return res.status(200).send({ result: result });
      })
      .catch(err => {
        console.log('刪除成員失敗');
        console.log(err);
        return res.redirect(302, '/admin/membersinfo');
      });
  }
}

module.exports = Member;
