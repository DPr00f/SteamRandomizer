var express = require('express');
var routes = require('../routes');
var user = require('../routes/user');


exports.routing = function(app){
	var connection = express.connection;
	app.get('/', routes.index);
	app.get('/users', user.list);
}