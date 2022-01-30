require('dotenv').config({ path: './config/development.env' });
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const helmet = require('helmet');
const path = require('path');
const PORT = 8080;
const member = require('./routes/member');
const admin = require('./routes/admin');
const authorization = require('./models/authorization');

console.log(process.env.NODE_ENV);

app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false
  })
);

app.set('view-engine', 'ejs');

//app.use(helmet());

//載入靜態資源
app.use(express.static(__dirname + '/public'));
// 解析Cookie
app.use(cookieParser());
// 解析表單內容
app.use(bodyParser.urlencoded({ extended: true }));
// 支援 json
app.use(bodyParser.json());

app.locals.adminOnly = null;
app.locals.errorLoginMessage = false;
app.locals.errEmail = [];
app.locals.errPassword = [];
app.locals.errUsername = [];
app.locals.errConfirmPassword = [];
app.locals.userID = false;
app.locals.errorLoginMessage = false;

app.use('/member', member);
app.use('/admin', admin);

/* app.use((req, res, next) => {
  console.log(req.session);
  next();
}); */

app.get('/', authorization(), (req, res) => {
  console.log(req.session.adminOnly);
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Home',
    userID: req.session.userId ? req.session.userId : false,
    adminOnly: req.session.adminOnly ? req.session.adminOnly : false
  });
});

app.get('/login', authorization(), (req, res) => {
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Login',
    userID: req.session.userId ? req.session.userId : false
  });
});

app.get('/register', authorization(), (req, res) => {
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Register',
    userID: req.session.userId ? req.session.userId : false
  });
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(PORT, () => {
  console.log('Server is listening on ' + PORT);
});

module.exports = app;
