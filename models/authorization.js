const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  const token = req.cookies['x-access-token'];
  if (!token) {
    return res.redirect('/');
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }
    res.locals.isLogin = true; // Login status for header.ejs
    req.userId = decoded.id;
    next();
  });
};

module.exports = authorization;
