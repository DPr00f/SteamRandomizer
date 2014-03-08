var express = require('express');
var controllers = require('../controllers');
var user = require('../controllers/user');


exports.routing = function(app){
	var connection = express.connection;
	GLOBAL.app = app;
	app.get('/', controllers.index);
	app.post('/u', user.postSteamID);
	app.get('/u/:steamID', user.getGames);
}