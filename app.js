
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : ''
});
var databaseName = "steamrand"


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

crashed = connection.connect(function(err) {
	// connected! (unless `err` is set)
	if(err){
		throw err;
		return true;
	}
});

if(!crashed){
	connection.query('USE ' + databaseName, function(err, rows){
		if(err){
			throw err;
			return;
		}
		http.createServer(app).listen(app.get('port'), function(){
			console.log('Express server listening on port ' + app.get('port'));
		});
	})
}
