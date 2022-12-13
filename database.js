'use strict'

//connection to database
  const mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vaahtokarkki",
    database: "fl1ght_game"
  });

  connection.connect((err) => {
    if(err){
      console.log('Error connecting to database');
      return;
    }
    console.log('Connection established sucessfully');
  });
  connection.end((err) => {
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT location FROM  game", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });