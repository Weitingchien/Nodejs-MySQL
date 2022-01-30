const jwt = require('jsonwebtoken');
const dbConnect = require('../config/db');
const path = require('path');

const authorization = (role = 'guest') => {
  return (req, res, next) => {
    const token = req.cookies['x-access-token'];
    if (role === 'guest' && !token) {
      req.session.adminOnly = null;
      return next();
    }
    if (!token) {
      console.log('沒有token');
      res.locals.userID = false;
      req.session.adminOnly = null;
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
            console.log('驗證失敗');
            return res.status(401).send({
              message: "Can't find this member"
            });
          } else if (result.length) {
            console.log('驗證成功');
            //console.log(result);
            //res.locals.userID = result[0].ID; // Login status for header.ejs
            req.userId = decoded._id;
            let path = req.url.split('/')[0];
            if (result[0].role === 'superadmin') {
              console.log('2');
              req.session.adminOnly = true;
              return next();
            } else if (path === 'admin' || result[0].role === 'admin') {
              console.log('3');
              req.session.adminOnly = true;
              return next();
            } else if (role === 'guest' && result[0].role === 'member') {
              console.log('4');
              req.session.adminOnly = null;
              return next();
            } else if (
              (path === 'member' && role === result[0].role) ||
              (path === '' && role === result[0].role)
            ) {
              console.log('5');
              req.session.adminOnly = null;
              return next();
            } else {
              console.log('6');
              req.session.adminOnly = null;
              return res.redirect(302, '/');
            }
          }
        }
      );
    });
  };
};

module.exports = authorization;
