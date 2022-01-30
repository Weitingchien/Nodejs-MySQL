const dbConnect = require('../config/db');
const path = require('path');

const info = (req, res, status) => {
  const data = {};
  if (status === 'get') {
    return new Promise((resolve, reject) => {
      dbConnect.query('SELECT * FROM member', (err, result) => {
        if (err) {
          data.error = '取得成員資料失敗';
          reject(data);
          return;
        }
        let dataForRendering = [];
        result.forEach((user, index) => {
          delete user.password;
        });
        dataForRendering = result;
        res.render(path.join(__dirname, '../views/index.ejs'), {
          currentPage: 'Admin_AllMemberInfo',
          allUser: dataForRendering,
          userID: req.userId ? req.userId : false
        });
        resolve(result);
      });
    });
  } else if (status === 'update') {
    return new Promise((resolve, reject) => {
      dbConnect.query(
        'UPDATE member SET username = ?, email = ?, role = ? WHERE ID = ?',
        [req.body.username, req.body.email, req.body.role, req.body.id],
        (err, result) => {
          if (err) {
            data.error = '更新成員資料失敗';
            reject(data);
            return;
          }
          resolve(result);
        }
      );
    });
  } else if (status === 'delete') {
    console.log(req.body.id);
    return new Promise((resolve, reject) => {
      dbConnect.query(
        'DELETE FROM member WHERE ID = ?',
        req.body.id,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
};

module.exports = info;
