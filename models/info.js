const dbConnect = require('../config/db');
const error = require('./error');
const path = require('path');

const info = (req, res) => {
  const data = {};
  return new Promise((resolve, reject) => {
    dbConnect.query('SELECT * FROM member', (err, result) => {
      if (err) {
        error(data, reject);
        reject(data);
        return;
      }
      let dataForRendering = [];
      result.forEach((user, index) => {
        delete user.password;
      });
      dataForRendering = result;
      /*       res.locals.allUser = dataForRendering;
      res.locals.currentPage = 'Admin_AllMemberInfo'; */
      res.render(path.join(__dirname, '../views/index.ejs'), {
        currentPage: 'Admin_AllMemberInfo',
        allUser: dataForRendering
      });
      resolve(result);
    });
  });
};

module.exports = info;
