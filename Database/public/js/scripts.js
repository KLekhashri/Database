
function sortTable(n) {
  var table = document.getElementById("table");
  var count = 0;
  var switching = true;

  var direction = "ascending";

  while (switching) {
    switching = false;
    var rows = table.rows;

    for (var i = 1; i < rows.length - 1; i++) {
      var Switch = false;

      var x = rows[i].getElementsByTagName("TD")[n];
      var y = rows[i + 1].getElementsByTagName("TD")[n];

      if (direction == "ascending") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          Switch = true;
          break;
        }
      } else if (direction == "descending") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          Switch = true;
          break;
        }
      }
    }
    if (Switch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;

      count++;
    } else {
      if (count == 0 && direction == "ascending") {
        direction = "descending";
        switching = true;
      }
    }
  }
}

function sortTable_Int_Float(n) {
  var table = document.getElementById("table");
  var count = 0;
  var switching = true;

  var direction = "ascending";

  while (switching) {
    switching = false;
    var rows = table.rows;

    for (var i = 1; i < rows.length - 1; i++) {
      var Switch = false;

      var x = rows[i].getElementsByTagName("TD")[n];
      var y = rows[i + 1].getElementsByTagName("TD")[n];

      if (direction == "ascending") {
        if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
          Switch = true;
          break;
        }
      } else if (direction == "descending") {
        if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
          Switch = true;
          break;
        }
      }
    }
    if (Switch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;

      count++;
    } else {
      if (count == 0 && direction == "ascending") {
        direction = "descending";
        switching = true;
      }
    }
  }
}
