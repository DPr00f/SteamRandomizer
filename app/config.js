var express = require('express')
var path = require('path')
var fs = require('fs');
var configurationFile = JSON.parse(fs.readFileSync('package.json'));


var setSteamAPIKey = function(app){
	app.set('steam-api-key', configurationFile.steamAPIKey);
}

var setSteamUserToLoad = function(app){
	app.set('steam-user', configurationFile.steamUser);
}

var setDatabaseData = function(app){
	if('development' == app.get('env')){
		app.set('db', {
			host: 'localhost',
			database: 'steamrand',
			user: 'root',
			password: ''
		});
	}else if('heroku' == app.get('env')){
		var herokuFile = JSON.parse(fs.readFileSync('heroku.json'));
		app.set('db', {
			host: herokuFile.host,
			database: herokuFile.database,
			user: herokuFile.user,
			password: herokuFile.password
		});
	}
}

exports.setup = function(app){
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');
	setDatabaseData(app);
	setSteamUserToLoad(app);
	setSteamAPIKey(app);
}


exports.middlewares = function(app){
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '../public')));
}


// development only
exports.development = function(app){
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}
}