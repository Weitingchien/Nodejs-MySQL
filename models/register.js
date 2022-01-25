const dbConnect = require('../config/db');
const error = require('./error');

const register = memberData => {
  console.log(memberData);
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query(
      'SELECT email FROM member WHERE email = ? OR username = ?',
      [memberData.email, memberData.username],
      (err, results) => {
        if (err) {
          error(data, reject);
        }
        console.log(results.length);
        if (results.length >= 1) {
          data.status = 406;
          data.error = '重複的E-mail或重複的使用者名稱';
          reject(data);
        } else {
          dbConnect.query(
            'INSERT INTO member SET ?',
            memberData,
            (err, results) => {
              if (err) {
                error(data, reject);
              }
              data.status = 201;
              data.success = '新增成功';
              data.error = null;
              resolve(data);
            }
          );
        }
      }
    );
  });
};

module.exports = register;
