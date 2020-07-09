var sql = require('mssql');

var dbConfig = {
  server: "localhost",
  database: "myDB",
  user: "sa",
  password: "norolepc123",
  port: 2541
};

function getEmp() {
	var conn = new sql.ConnectionPool(dbConfig)
	var req = new sql.Request(conn);
	conn.connect(function (err) {
		if (err) {
			console.log(err);
			return;
			}
		req.query("SELECT * FROM Employees", function(err , recordset) {
			if(err) {
				console.log(err);
			}
			else { 
				console.log(recordset);
			}
			conn.close();
		});
	});
}

getEmp();
