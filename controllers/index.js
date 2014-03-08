
/*
 * GET home page.
 */

exports.index = function(req, res){
	// res.render('index', { title: 'Steam Games', games: games });
	res.render('index', { title: 'Steam Games'});
};