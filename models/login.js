const dbConnect = require('../config/db');
const jwt = require('jsonwebtoken');
const path = require('path');

// Generating tokens
const signToken = result => {
  if (result.length === 0) return;
  return jwt.sign(
    { _id: result[0].ID }, // payload
    process.env.SECRET, // secret
    { expiresIn: Math.floor(Date.now() / 1000 + 60 * 10), algorithm: 'HS256' } // options ， token 10分鐘後過期
  );
};

const login = (memberData, res, next) => {
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query(
      'SELECT * FROM member WHERE email = ? AND password = ?',
      [memberData.email, memberData.password],
      (err, result) => {
        if (err) {
          data.status = 403;
          data.error = '找不到此帳戶!';
          console.log('找不到此帳戶!');
          //reject(data);
          return;
        } else if (result.length === 0) {
          data.error = '您有欄位沒有輸入';
          //reject(data);
          return;
        }
        //axios不能從server端轉址，只能從client端使用window.location.href來轉址，要從server端轉址，client要使用傳統表單的方式來post
        res.locals.isLogin = true;
        res.cookie('x-access-token', signToken(result), {
          httpOnly: true,
          maxAge: 600000, //10分鐘
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        resolve(result);
      }
    );
  });
};

module.exports = login;
