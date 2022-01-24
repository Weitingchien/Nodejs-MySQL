const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: '',
  database: process.env.DB_DATABASE
});

dbConnection.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = dbConnection;
