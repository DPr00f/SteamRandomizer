
/*
 * GET home page.
 */

var steam = require('../app/steam')

exports.index = function(req, res){
	steam.getOwnedGames(function(games){
		res.render('index', { title: 'Steam Games', games: games });
	});
};