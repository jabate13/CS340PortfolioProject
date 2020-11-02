//Boilerplate stuffs For handlebars and express
var express = require('express');
var app = express();
var handlebars = require('express-handlebars');
var CORS = require('cors');

// Connect to the database
var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'classmysql.engr.oregonstate.edu',
  user : 'cs340_abatej',
  password : '5225',
  database : 'cs340_abatej'
});

app.use(express.static('public'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('port', 4852);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

// Query Strings
const selectQuery = 'SELECT * FROM Planets';
const insertQuery = "INSERT INTO Planets (`name`, `size`, `color`) VALUES (?, ?, ?)";
const updateQuery = "UPDATE Planets SET name=?, size=?, color=? WHERE planetID=? ";
const deleteQuery = "DELETE FROM Planets WHERE planetID=?";
const dropTableQuery = "DROP TABLE IF EXISTS Planets";
const makeTableQuery = "CREATE TABLE Planets (" +
                        "planetID INT PRIMARY KEY AUTO_INCREMENT," +
                        "name VARCHAR(255) NOT NULL," +
                        "size INT NOT NULL," +
                        "color VARCHAR(255) NOT NULL)"

// Routing

const getAllData = (req, res, next) => {
    pool.query(selectQuery, function(err, rows, fields){
      if (err) {
        next(err);
        return;
      }
      res.send(json({ rows: rows }));
    });
};


// Selecting the data
app.get('/',function(req,res,next){
  var context = {};
  pool.query(selectQuery, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
  });
});

//Updating the database
app.put('/',function(req,res,next){
  var context = {};
  var { name, reps, weight, lbs, date, id } = req.body; //Object destructuring
  pool.query(updateQuery,
    [name, reps, weight, lbs, date, id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    //getAllData();
	res.send(context);
  });
});

//Insert query
app.post('/', function(req, res, next){
  var context = {};
  var { name, reps, weight, lbs, date } = req.body; //Object destructuring

  console.log(name, reps, weight, lbs, date);
  pool.query(insertQuery, [name, reps, weight, lbs, date], function(err, result){
    if(err){
      next(err);
      return;
    }
    //getAllData();
	res.send(context);
  });
});

//DELETE
app.delete('/', function(req, res, next){
  var context = {};
  var { id } = req.body;
  pool.query(deleteQuery, [id], function(err, result){
    if (err) {
      next(err);
      return;
    }
    //getAllData();
	res.send(context);
  })
})

// Empty the table
app.get('/reset-table', function(req, res, next){
  var context = {};
  pool.query(dropTableQuery, function(err){
    pool.query(makeTableQuery, function(err){
      context.results = "Table reset";
    })
  });
});

app.listen(app.get('port'), function(){
  console.log('Serving is starting at port', app.get('port'));
});
