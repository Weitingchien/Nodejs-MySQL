const jwt = require('jsonwebtoken');
const dbConnect = require('../config/db');
const path = require('path');

const authorization = (req, res, next) => {
  const token = req.cookies['x-access-token'];
  if (!token) {
    res.locals.isLogin = false;
    return res.render(path.join(__dirname, '../views/index.ejs'), {
      currentPage: 'Home'
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }
    dbConnect.query(
      'SELECT * FROM member WHERE ID = ?',
      decoded._id,
      (err, result) => {
        if (err) {
          return res.status(401).send({
            message: "Can't find this member"
          });
        } else if (result.length) {
          console.log('驗證成功');
          res.locals.isLogin = true; // Login status for header.ejs
          req.userId = decoded._id;
          let path = req.url.split('/')[0];
          console.log(role);
          if (result[0].role === 'admin') {
            res.locals.adminOnly = true;
            return next();
          } else if (
            (path === 'member' && result[0].role === 'member') ||
            (path === '' && result[0].role === 'member')
          ) {
            console.log(result[0].role);
            return next();
          }
          return res.render(path.join(__dirname, '../views/index.ejs'), {
            currentPage: 'Home'
          });
        }
      }
    );
  });
};

module.exports = authorization;
