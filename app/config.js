var express = require('express')
var path = require('path')


var setDatabaseData = function(app){
	if('development' == app.get('env')){
		app.set('db', {
			host: 'localhost',
			database: 'steamrand',
			user: 'root',
			password: ''
		});
	}
}

exports.setup = function(app){
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');
	setDatabaseData(app);
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