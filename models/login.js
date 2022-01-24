const dbConnect = require('../config/db');
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

const login = (memberData, res, token) => {
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query(
      'SELECT * FROM member WHERE email = ? AND password = ?',
      [memberData.email, memberData.password],
      (err, result) => {
        if (err) {
          data.status = 403;
          data.error = '找不到此帳戶!';
          reject(data);
          return;
        }
        res
          .cookie('x-access-token', signToken(result), {
            httpOnly: true,
            maxAge: 60000, //1分鐘
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          .status(200)
          .send({
            id: result[0].ID,
            email: result[0].email,
            message: 'Logged in successfully!'
          });
        resolve(result);
      }
    );
  });
};

module.exports = login;
