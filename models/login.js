const dbConnect = require('./db');

const login = memberData => {
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query(
      'SELECT * FROM member WHERE email = ? AND password = ?',
      [memberData.email, memberData.password],
      (err, result) => {
        console.log(err, result);
        if (err) {
          data.status = 403;
          data.error = '找不到此帳戶!';
          reject(data);
          return;
        }
        resolve(result);
      }
    );
  });
};

module.exports = login;
