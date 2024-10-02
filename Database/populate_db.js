const mysql = require("mysql");
const csvtojson = require("csvtojson");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql@23",
  database: "Books",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to Books database");
  var deleteExistingTables =
    "DROP TABLE IF EXISTS cover, inventory, author, publisher, location, category, format, book";
  db.query(deleteExistingTables, function (err, result) {
    if (err) throw err;
    console.log("All existing tables deleted");
  });

  //Create several tables in the database: author, publisher, location, category, and format.

  var authorTable =
    "CREATE TABLE IF NOT EXISTS author (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "author VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id))";
  db.query(authorTable, function (err, result) {
    if (err) throw err;
    console.log("Author Table created in database");
  });

  var publisherTable =
    "CREATE TABLE IF NOT EXISTS publisher (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "publisher VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id))";
  db.query(publisherTable, function (err, result) {
    if (err) throw err;
    console.log("Publisher Table created in database");
  });

  var locationTable =
    "CREATE TABLE IF NOT EXISTS location (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "city VARCHAR(255) NOT NULL," +
    "country VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id))";
  db.query(locationTable, function (err, result) {
    if (err) throw err;
    console.log("Location Table created in database");
  });

  var categoryTable =
    "CREATE TABLE IF NOT EXISTS category (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "category VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id))";
  db.query(categoryTable, function (err, result) {
    if (err) throw err;
    console.log("Category Table created in database");
  });

  var formatTable =
    "CREATE TABLE IF NOT EXISTS format (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "format VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id))";
  db.query(formatTable, function (err, result) {
    if (err) throw err;
    console.log("Format Table created in database");
  });

  //create book table
  var bookTable =
    "CREATE TABLE IF NOT EXISTS book (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "ISBN VARCHAR(255) NOT NULL," +
    "title VARCHAR(255) NOT NULL," +
    "year INT UNSIGNED NOT NULL," +
    "price DECIMAL(5, 2) UNSIGNED NOT NULL," +
    "rating DECIMAL(4, 2) UNSIGNED NOT NULL," +
    "length INT UNSIGNED," +
    "author_id INT UNSIGNED NOT NULL," +
    "publisher_id INT UNSIGNED NOT NULL," +
    "location_id INT UNSIGNED NOT NULL," +
    "category_id INT UNSIGNED NOT NULL," +
    "format_id INT UNSIGNED NOT NULL," +
    "PRIMARY KEY(id)," +
    "FOREIGN KEY (author_id) REFERENCES author(id)," +
    "FOREIGN KEY (publisher_id) REFERENCES publisher(id)," +
    "FOREIGN KEY (location_id) REFERENCES location(id)," +
    "FOREIGN KEY (category_id) REFERENCES category(id)," +
    "FOREIGN KEY (format_id) REFERENCES format(id))";

  db.query(bookTable, function (err, result) {
    if (err) throw err;
    console.log("Book Table created in database");
  });

  // create cover table
  var coverTable =
    "CREATE TABLE IF NOT EXISTS cover (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "url VARCHAR(255) NOT NULL," +
    "image VARCHAR(255) NOT NULL," +
    "PRIMARY KEY(id)," +
    "book_id INT UNSIGNED NOT NULL," +
    "FOREIGN KEY (book_id) REFERENCES book(id))";

  db.query(coverTable, function (err, result) {
    if (err) throw err;
    console.log("Cover Table created in database");
  });

  //create inventory table
  var inventoryTable =
    "CREATE TABLE IF NOT EXISTS inventory (" +
    "id INT UNSIGNED AUTO_INCREMENT NOT NULL," +
    "quantity INT UNSIGNED NOT NULL," +
    "PRIMARY KEY(id)," +
    "book_id INT UNSIGNED NOT NULL," +
    "FOREIGN KEY (book_id) REFERENCES book(id))";

  db.query(inventoryTable, function (err, result) {
    if (err) throw err;
    console.log("Inventory Table created in database");
  });
});

const csvFile = "data/book_dataset.csv";

//converting csv to json
csvtojson()
  .fromFile(csvFile)
  .then((source) => {
    var author_list = [];
    var author_full = [];

    var publisher_list = [];
    var publisher_full = [];

    var location_list = [];
    var location_full = [];

    var url_list = [];
    var image_list = [];

    var quantity_list = [];

    var category_list = [];
    var category_full = [];

    var format_list = [];
    var format_full = [];

    var ISBN_list = [];
    var title_list = [];
    var year_list = [];
    var price_list = [];
    var rating_list = [];
    var length_list = [];

    //looping to push to the data to its respective list
    for (var i = 0; i < source.length; i++) {
      var author = source[i]["author"];

      var publisher = source[i]["publisher"];

      var location = source[i]["city/country"];

      var url = source[i]["url"];
      var image = source[i]["image"];

      var quantity = source[i]["quantity"];

      var category = source[i]["categories"];

      var format = source[i]["format"];

      var bookISBN = source[i]["ISBN"];
      var bookTitle = source[i]["title"];
      var bookYear = source[i]["year"];
      var bookPrice = source[i]["price"];
      var bookRating = source[i]["rating"];
      var bookLength = source[i]["length"];

      //removing repetitive data
      if (author_list.includes(author) === false) author_list.push(author);
      if (publisher_list.includes(publisher) === false)
        publisher_list.push(publisher);
      if (category_list.includes(category) === false)
        category_list.push(category);
      if (format_list.includes(format) === false) format_list.push(format);

      if (location_list.includes(location) === false)
        location_list.push(location);

      url_list.push(url);
      image_list.push(image);
      quantity_list.push(quantity);

      ISBN_list.push(bookISBN);
      title_list.push(bookTitle);
      year_list.push(bookYear);
      price_list.push(bookPrice);
      rating_list.push(bookRating);
      length_list.push(bookLength);

      author_full.push(author);
      publisher_full.push(publisher);
      location_full.push(location);
      category_full.push(category);
      format_full.push(format);
    }

    for (var i = 0; i < author_list.length; i++) {
      var sqlinsert = `INSERT INTO author values(?, ?)`;

      var data = [i + 1, author_list[i]];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert author item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < publisher_list.length; i++) {
      var sqlinsert = `INSERT INTO publisher values(?, ?)`;

      var data = [i + 1, publisher_list[i]];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert publisher item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    //splitting city and country into two different columns
    var city = [];
    var country = [];

    for (var i = 0; i < location_list.length; i++) {
      var city_temp = "";

      var city_country_pair = location_list[i].split(", ");

      if (city_country_pair == "") {
        city.push("NULL");
        country.push("NULL");
      } else if (city_country_pair.length == 1) {
        city.push("NULL");
        country.push(city_country_pair[0]);
      } else if (city_country_pair.length == 2) {
        city.push(city_country_pair[0]);
        country.push(city_country_pair[1]);
      } else if (city_country_pair.length > 2) {
        for (var x = 0; x < city_country_pair.length - 1; x++) {
          if (x == city_country_pair.length - 2) {
            city_temp = city_temp + city_country_pair[x];
          } else {
            city_temp = city_temp + city_country_pair[x] + ", ";
          }
        }

        city.push(city_temp);

        country.push(city_country_pair[city_country_pair.length - 1]);
      }

      var sqlinsert = `INSERT INTO location values(?, ?, ?)`;

      var data = [i + 1, city[i], country[i]];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert location item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < category_list.length; i++) {
      var sqlinsert = `INSERT INTO category values(?, ?)`;

      var data = [i + 1, category_list[i]];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert category item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < format_list.length; i++) {
      var sqlinsert = `INSERT INTO format values(?, ?)`;

      var data = [i + 1, format_list[i]];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert format item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < ISBN_list.length; i++) {
      var author_id;
      var publisher_id;
      var location_id;
      var category_id;
      var format_id;

      for (var a = 0; a < author_list.length; a++) {
        if (author_full[i] == author_list[a]) {
          author_id = a + 1;
        }
      }

      for (var a = 0; a < publisher_list.length; a++) {
        if (publisher_full[i] == publisher_list[a]) {
          publisher_id = a + 1;
        }
      }

      for (var a = 0; a < location_list.length; a++) {
        if (location_full[i] == location_list[a]) {
          location_id = a + 1;
        }
      }

      for (var a = 0; a < category_list.length; a++) {
        if (category_full[i] == category_list[a]) {
          category_id = a + 1;
        }
      }

      for (var a = 0; a < format_list.length; a++) {
        if (format_full[i] == format_list[a]) {
          format_id = a + 1;
        }
      }

      var sqlinsert = `INSERT INTO book values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      var data = [
        i + 1,
        ISBN_list[i],
        title_list[i],
        year_list[i],
        price_list[i],
        rating_list[i],
        length_list[i],
        author_id,
        publisher_id,
        location_id,
        category_id,
        format_id,
      ];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert book item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < url_list.length; i++) {
      var sqlinsert = `INSERT INTO cover values(?, ?, ?, ?)`;

      var data = [i + 1, url_list[i], image_list[i], i + 1];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert cover item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    for (var i = 0; i < quantity_list.length; i++) {
      var sqlinsert = `INSERT INTO inventory values(?, ?, ?)`;

      var data = [i + 1, quantity_list[i], i + 1];

      db.query(sqlinsert, data, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert inventory item at row ", i + 1);
          return console.log(err);
        }
      });
    }

    console.log("All items stored into database successfully");
  });
