'use strict';

var controllers = require('../controllers'),
    user = require('../controllers/user');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

exports.routing = function routing(){
  var app = GLOBAL.app;
  app.get('/', controllers.index);
  app.post('/u', user.postSteamID);
  app.get('/u/:steamID', user.getGames);
  app.get('/games', ensureAuthenticated, user.games);
};