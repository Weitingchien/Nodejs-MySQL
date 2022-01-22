const register = require('../models/register');
const login = require('../models/login');
const encryption = require('../models/encryption');
const jwt = require('jsonwebtoken');

// Generating tokens
const signToken = result => {
  return jwt.sign(
    {
      algorithm: 'HS256',
      exp: Math.floor(Date.now() / 1000 + 60 * 10), // token 10分鐘後過期
      data: result[0].ID
    },
    process.env.SECRET
  );
};

class Member {
  toRegister(req, res, next) {
    const { email, password } = req.body;
    console.log(req.body);
    const encryptPassword = encryption(password);
    const memberData = {
      email: email,
      password: encryptPassword
    };
    register(memberData)
      .then(result => {
        res.json({ result: result });
      })
      .catch(err => {
        console.log(err);
        res.json({ err: err });
      });
  }
  toLogin(req, res, next) {
    const { email, password } = req.body;
    const encryptPassword = encryption(password);
    const memberData = {
      email: email,
      password: encryptPassword
    };
    login(memberData)
      .then(result => {
        res.setHeader('token', signToken(result));
        console.log(signToken(result));
        res.json({ result: result });
      })
      .catch(err => {
        console.log('失敗!');
        res.json({ err: err });
      });
  }
}

module.exports = Member;
