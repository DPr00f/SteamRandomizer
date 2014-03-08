var express = require('express');
var isNumeric = require("isnumeric");
var request = require("request");
var xml2js = require('xml2js');

var getWebsite = function(url, cb){
	request({
		uri: url
	}, function(error, response, body) {
		cb(error, response, body);
	});
}


var getSteamId = function(user, cb){
	var url = "http://steamcommunity.com/";

	if(isNumeric(user)){
		url += 'profiles/';
	}else{
		url += 'id/';
	}
	url += user + "?xml=1";

	getWebsite(url, function(error, response, body){
		if(error){
			throw error;
			return;
		}
		var xmlParser = new xml2js.Parser();
		xmlParser.parseString(body, function (error, result) {
			if(error){
				throw error;
				return;
			}
			if(result && result.profile && result.profile.steamID64 && result.profile.steamID64[0]){
				cb(null, result.profile.steamID64[0]);
			}else{
				cb(new Error('Steam ID couldn\'t be found'));
			}
		});
	});
}


exports.getUserSteamID = function(cb){
	var user = GLOBAL.app.get('steam-user');
	var steamId = GLOBAL.app.get(user + '-id');
	if(!steamId){
		getSteamId(user, function(error, id){
			if(error){
				throw error;
				return;
			}
			GLOBAL.app.set(user + '-id', id);
			cb(id);
		});
	}else{
		cb(steamId);
	}
}


exports.getOwnedGames = function(cb){
	this.getUserSteamID(function(steamID){
		var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=<steam-api-key>&steamid=<steamID>&include_appinfo=1&format=json";
		url = url.replace(/<steam-api-key>/g, GLOBAL.app.get('steam-api-key'));
		url = url.replace(/<steamID>/g, steamID);

		getWebsite(url, function(error, response, body){
			if(error){
				throw error;
				return;
			}
			data = JSON.parse(body);
			// TODO: validate
			cb(data.response.games);
		});
	});
}