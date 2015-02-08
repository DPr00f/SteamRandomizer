
/**
 * Module dependencies.
 */

var express = require('express');

var config = require('./app/config');
var http = require('http');
var path = require('path');
var mysql = require('./app/mysql');

var app = express();
GLOBAL.app = app;

config.setup(app);
config.middlewares(app);
mysql.connect(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
