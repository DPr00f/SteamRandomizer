var express = require('express');
var isNumeric = require("isnumeric");
var request = require("request");
var xml2js = require('xml2js');

// Returns error, response, body
var getWebsite = function getWebsite(url, cb){
	request({
		uri: url
	}, function(error, response, body) {
		cb(error, response, body);
	});
};


// Returns error, steamID, isPrivate, avatar
var getSteamIdAndAvatar = function getSteamIdAndAvatar(user, cb){
	var url = "http://steamcommunity.com/";

	if(isNumeric(user)){
		url += 'profiles/';
	}else{
		url += 'id/';
	}
	url += user + "?json=1";
	getWebsite(url, function(error, response, body){
		if(error){
			throw error;
			return;
		}
		if(body.match(/503 Service Unavailable/g)){
			cb(new Error('Service Unavailable'));
			return;
		}
		var xmlParser = new xml2js.Parser();
		xmlParser.parseString(body, function (error, result) {
			if(error){
				throw error;
				return;
			}
			if(result && result.profile && result.profile.steamID64 && result.profile.steamID64[0]){
				var isPrivate = false;
				var avatar;
				if(result.profile.privacyState && result.profile.privacyState[0] !== "public"){
					isPrivate = true;
				}
				if(result.profile.avatarIcon && result.profile.avatarIcon[0]){
					avatar = result.profile.avatarIcon[0];
				}
				cb(null, result.profile.steamID64[0], isPrivate, avatar);
			}else{
				cb(new Error('Steam ID couldn\'t be found'));
			}
		});
	});
};


// Returns error, steamID, isPrivate, avatar
exports.getUserSteamIDAndAvatar = function getUserSteamIDAndAvatar(user, cb){
	user = user || GLOBAL.app.get('steam-user');
	getSteamIdAndAvatar(user, function(error, id, isPrivate, avatar){
		var retError;
		if(error){
			retError = {};
			if(error.message === 'Steam ID couldn\'t be found'){
				retError.wrongSteamID = true;
			}else if(error.message === 'Service Unavailable'){
				retError.steamDown = true;
			}else{
				throw error;
				return;
			}
		}
		cb(retError, id, isPrivate, avatar);
	});
};


// Returns steamError {wrongSteamID, steamDown, isPrivate}, gamesList
exports.getOwnedGames = function getOwnedGames(user, cb){
	this.getUserSteamIDAndAvatar(user, function(steamError, steamID, isPrivate, avatar){
		var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=<steam-api-key>&steamid=<steamID>&include_appinfo=1&format=json";
		url = url.replace(/<steam-api-key>/g, GLOBAL.app.get('steam-api-key'));
		url = url.replace(/<steamID>/g, steamID);
		if(isPrivate){
			if(!steamError){
				steamError = {};
			}
			steamError.isPrivate = true;
		}
		if(steamError){
			cb(steamError);
			return;
		}
		getWebsite(url, function(error, response, body){
			if(error){
				throw error;
				return;
			}
			data = JSON.parse(body);
			cb(false, data.response.games, avatar);
		});
	});
};