var express = require('express');
var controllers = require('../controllers');
var user = require('../controllers/user');


exports.routing = function(app){
	var connection = express.connection;
	app.get('/', controllers.index);
	app.get('/users', user.list);
}