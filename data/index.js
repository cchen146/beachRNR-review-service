const mysql  = require('mysql');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
};

let host = process.env.MYSQL_HOST;
let user = process.env.MYSQL_USER;
let password = process.env.MYSQL_PASSWORD || '';
let port = process.env.MYSQL_PORT || '';

const connection = mysql.createConnection({
  host     : host,
  user     : user,
  password : password,
  port     : port,
  multipleStatements: true
});

connection.connect((err) => {
  if(!err) {
      console.log("Database is connected ... ");
  } else {
      console.log("Error connecting database ... ");
  }
});

module.exports.connection = connection;








