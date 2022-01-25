const register = require('../models/register');
const login = require('../models/login');
const info = require('../models/info');
const encryption = require('../models/encryption');

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
        //res.json({ result: result });
        next();
      })
      .catch(err => {
        console.log(err);
        //res.json({ err: err });
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
    login(memberData, res, next)
      .then(result => {
        console.log('登入成功!');
        // 要使用next()才能往下執行下一個middleware，這邊的下一個middleware是member.js裡的redirectBack函式
        return next();
      })
      .catch(err => {
        console.log('登入失敗!');
        res.status(500).send({ message: err.message });
      });
  }

  toLogout(req, res, next) {
    res.locals.isLogin = false;
    return res.clearCookie('x-access-token').redirect('/');
  }

  getInfo(req, res, next) {
    info(req, res)
      .then(result => {
        console.log('成功獲取所有成員資訊');
      })
      .catch(err => {
        console.log('獲取失敗!');
        res.status(500).send({ message: err.message });
      });
  }
}

module.exports = Member;
