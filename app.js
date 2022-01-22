require('dotenv').config({ path: './config/development.env' });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 8080;
const member = require('./routes/member');

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rendering index.ejs
app.get('/', (req, res) => {
  res.render('register.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.use('/', member);

app.listen(PORT, () => {
  console.log('Server is listening on ' + PORT);
});

module.exports = app;
