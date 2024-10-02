const mysql = require("mysql");

// This code establishes a connection to a MySQL database named "Books" hosted locally, utilizing the root user with a specified password for authentication.
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql@23",
  database: "Books",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // This code checks if the database named "Books" exists; if not, it creates it. Upon successful creation, it logs a message confirming the creation of the Books database.
  db.query("CREATE DATABASE IF NOT EXISTS Books", function (err, result) {
    if (err) throw err;
    console.log("Books database created");
  });
});
