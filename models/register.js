const dbConnect = require('./db');
const error = require('./error');

const register = memberData => {
  console.log(memberData);
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query(
      'SELECT email FROM member WHERE email = ?',
      [memberData.email],
      (err, results) => {
        if (err) {
          error(data, reject);
        }
        console.log(results.length);
        if (results.length >= 1) {
          data.status = 406;
          data.error = '重複的E-mail';
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
