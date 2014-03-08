var express = require('express');
var mysql = require('mysql');

exports.connect = function(app){
	var db = app.get('db');
	express.connection = mysql.createConnection({ host: db.host, user : db.user, password : db.password });
	express.connection.query("USE " + db.database);
}