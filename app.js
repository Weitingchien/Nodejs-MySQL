require('dotenv').config({ path: './config/development.env' });
const express = require('express');
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

app.use('/', member);
app.use('/', admin);

app.get('/', authorization, (req, res) => {
  //res.locals.isLogin = false;
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Home'
  });
});

app.get('/login', (req, res) => {
  res.locals.isLogin = false;
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Login'
  });
});

app.get('/register', (req, res) => {
  res.locals.isLogin = false;
  res.render(path.join(__dirname, 'views/index.ejs'), {
    currentPage: 'Register',
    errorMessages: false
  });
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(PORT, () => {
  console.log('Server is listening on ' + PORT);
});

module.exports = app;
