
/**
 * Module dependencies.
 */

var express = require('express');

var config = require('./app/config');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mysql = require('./app/mysql');
var configurationFile = JSON.parse(fs.readFileSync('package.json'));
var urls = require('./app/urlMappings');

var app = express();

config.setup(app);
config.middlewares(app);
mysql.connect(app);
urls.routing(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
