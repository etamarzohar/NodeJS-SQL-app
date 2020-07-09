const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const sql = require('mssql');
const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
var key = 0;
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
  console.log("Trying to create new employee...")
  var connection = new sql.ConnectionPool({
    server: "localhost",
    database: "myDB",
    user: "sa",
    password: "norolepc123",
    port: 2541
  });
  const makeRequest = new sql.Request(connection)
  key = key + 1;
  const uname = req.body.create_user;
  const upsw = req.body.create_password;
  const uemail = req.body.create_email;
  const ubirth = req.body.create_birth;
  const updateUser = `INSERT INTO Users ([UserName],[PassWord],[DateOfBirth]) VALUES ('${uname}','${upsw}','${ubirth}')`;
  const updateEmail = `INSERT INTO EmailAddresses ([UserId],[URI]) VALUES (${key},'${uemail}')`;
  const updateAddress = `UPDATE Employees SET FirstName = '${uname}' WHERE FirstName = 'eladzohar86@gmail.com'`;
  connection.connect((err) => {
    if(err) {
      console.log("Failed to connect databse myDB: " + err);
      return;
    }
    console.log(" User Name " + "\t" + " Password " + "\t" + " Date Of Birth ")
    console.log(` ${uname} `+"\t"+` ${upsw} `+"\t"+` ${ubirth} `)
    connection.query(updateUser+updateEmail,(err, result) => {
      if(err) {
        console.log("Failed to create new employee in database myDB: " + err);
        res.sendStatus(500);
        return;
      }
      else {
        console.log("Number of records inserted: " + result.affectedRows);
      }
      connection.close()

    })

  })

})

app.get('/User', (req, res) => {
  console.log("Fetching employees from database myDB: ")
const connection = new sql.ConnectionPool({
  server: "localhost",
  database: "myDB",
  user: "sa",
  password: 'norolepc123',
  port: 2541
})
const makeRequest = new sql.Request(connection)
const queryString = `SELECT * FROM Users`;
connection.connect((err) => {
  if(err) {
    console.log("Failed to connect the database myDB: " + err)
    return
  }
  makeRequest.query(queryString, (err, rows, fields) => {
    if(err) {
      console.log("Failed to query for Users: " + err)
      res.sendStatus(500)
      return
    }
    else {
      console.log("Users query at /User successfully!") 
      res.json(rows);
    }
    connection.close()
})

})
})



app.get('/User/:id', (req, res) => {
  console.log("Fetching employees from database myDB: ")
const connection = new sql.ConnectionPool({
  server: "localhost",
  database: "myDB",
  user: "sa",
  password: 'norolepc123',
  port: 2541
})
const makeRequest = new sql.Request(connection)
const userId = req.params.id;
const queryString = `SELECT * FROM Users WHERE UserId = ${userId}`;
connection.connect((err) => {
  if(err) {
    console.log("Failed to connect the database myDB: " + err)
    return
  }
  makeRequest.query(queryString, (err, rows, fields) => {
    if(err) {
      console.log("Failed to query for Users: " + err)
      res.sendStatus(500)
      return
    }
    else {
      console.log("Users query at /User successfully!")
      res.json(rows);
    }
    connection.close()
})

})
})

/*app.post(("/employee_create") , (req, res) => {
  const dbConfig = {
    server: "localhost",
    database: "myDB",
    user: "sa",
    password: "norolepc123",
    port: 2541
  };
  const conn = new sql.ConnectionPool(dbConfig)
	const sendconn = new sql.Request(conn);
  const first_Name = req.body.create_first_name
  const last_Name = req.body.create_last_name
  const birth = req.body.create_birth
  const queryString = "INSERT INTO Employees (FirstName, LastName, DateOfBirth) VALUES (?, ?, ?)"
  conn.connect(function (err) {
		if (err) {
      console.log("Failed to insert new employee"+ err)
      res.sendStatus(500)
			return
			}
		sendconn.query(queryString, [first_Name, last_Name], (err , results, fields) => {
			if(err) {
				console.log(err);
			}
			else { 
				console.log("A new employee successfully created");
			}
			conn.close();
		});
	});

  
});*/





app.listen(8080, () => {
  console.log('Server is up and running at localhotst:8080...')
})
