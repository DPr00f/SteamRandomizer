var steam = require('../app/steam');

exports.postSteamID = function(req, res){
	var steamid = req.body.steamid;
	res.redirect('/u/' + steamid);
};

exports.getGames = function(req, res){
	steam.getOwnedGames(req.params.steamID, function(steamError, games, avatar){
		//SteamError {wrongSteamID, steamDown, isPrivate}
		if(steamError){
			if(steamError.wrongSteamID){
				res.render('wrong-id', {title: 'Wrong steamID', steamID: req.params.steamID});
			}else if(steamError.steamDown){
				res.render('steam-down', {title: 'Steam Down', steamID: req.params.steamID});
			}else if(steamError.isPrivate){
				res.render('private-profile', {title: 'Private profile', steamID: req.params.steamID});
			}
			return;
		}
		var largeAvatar = avatar.substr(0, avatar.length - 4) + '_full.jpg';
		res.render('listgames', { title: 'Steam Games of ' + req.params.steamID, steamID: req.params.steamID, games: games, avatar: largeAvatar});
	});
};