var express = require('express');
var controllers = require('../controllers');


exports.routing = function(app){
	var connection = express.connection;
	GLOBAL.app = app;
	app.get('/', controllers.index);
}