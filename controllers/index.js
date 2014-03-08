
/*
 * GET home page.
 */

var steam = require('../app/steam')

exports.index = function(req, res){
	// Load user SteamID
	steam.getUserSteamID(GLOBAL.app);
  	res.render('index', { title: 'Express' });
};