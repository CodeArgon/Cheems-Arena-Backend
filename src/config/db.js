import mysql from 'mysql';
var con=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cheemsarena"
});

con.connect(function (err) {
  if (err) {
    console.log(err)
  } else {

    console.log("DB Connected!");
  }
});

export default con;
