'use strict';

var steam = require('../app/steam'),
		steamApi = require('steam-api');

exports.postSteamID = function postSteamID(req, res){
	var steamid = req.body.steamid;
	res.redirect('/u/' + steamid);
};

exports.getGames = function getGames(req, res){
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

exports.account = function account(req, res){
	res.render('account', { user: req.user });
};

exports.games = function games(req, res) {
	var player = new steamApi.Player();
	player.GetOwnedGames(req.session.passport.user.id).done(function(result){
		res.json(result);
	});
};