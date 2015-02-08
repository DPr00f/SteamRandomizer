var express = require('express'),
    mysql = require('mysql'),
    env = process.env.NODE_ENV || 'dev',
    fs = require('fs'),
    jsonFile = JSON.parse(fs.readFileSync('./database.json'));

exports.connect = function(app){
	var db = app.get('db');
	express.connection = mysql.createConnection({ host: jsonFile[env].host, user : jsonFile[env].user, password: jsonFile[env].password });
	express.connection.query("USE " + jsonFile[env].database);
};