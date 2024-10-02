// Import libraries
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

// Initialise objects and declare constants

// Create app
const app = express();
// Declare webport
const port = 8088;

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql@23",
  database: "Books",
  multipleStatements: true,
});

// run .connect() to make connection
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

global.db = db;

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require("./routes/main")(app);

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));

// Templating engines
app.engine("html", require("ejs").renderFile);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Listen at the port
app.listen(port, () =>
  console.log(`Node server is running... on port ${port}!`)
);
