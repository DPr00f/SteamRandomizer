'use strict';

var express = require('express'),
    path = require('path'),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mapping = require('./urlMappings'),
    passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy,
    partials = require('express-partials'),
    steamApi = require('steam-api'),
	redirectHost = process.env.REDIRECT_REALM || 'http://localhost:3000/';


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: redirectHost + 'auth/steam/return',
    realm: redirectHost,
    profile: false
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

function setSteamAPIKey(app){
  app.set('steam-api-key', process.env.STEAM_API_KEY);
}

function setSteamUserToLoad(app){
  app.set('steam-user', 'pr00fgames');
}

exports.setup = function(app){
  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
  setSteamUserToLoad(app);
  setSteamAPIKey(app);
};

function initializeUser(req, res, next) {
   if ( req.isAuthenticated() && !req.session.passport.user.displayName ) {
    var steamId = req.session.passport.user.identifier.replace('http://steamcommunity.com/openid/id/', '');
    var user = new steamApi.User();
    user.GetPlayerSummaries(steamId).done(function(result){
      req.session.passport.user.id = steamId;
      req.session.passport.user.displayName = result.personaName;
      req.session.passport.user.profileUrl = result.profileUrl;
      req.session.passport.user.avatar = result.avatar;
      req.session.passport.user.avatarMedium = result.avatarMedium;
      req.session.passport.user.avatarFull = result.avatarFull;
      next();
    });
   }else{
    next();
   }
}

exports.middlewares = function(app){
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multipart());
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));
  app.use(partials());
  app.set('view options', { defaultLayout: 'layout' }); 
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(initializeUser);
  app.use(function (req, res, next) {
     res.locals = {
       userLogged: req.isAuthenticated(),
       user: req.isAuthenticated() ? req.session.passport.user : {}
     };
     next();
  });
  app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), function(req, res) { res.redirect('/'); });
  app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), function(req, res) { res.redirect('/'); });
  app.get('/logout', function(req, res){ req.logout(); res.redirect('/'); });
  mapping.routing();
  app.use(serveStatic(path.join(__dirname, '../public')));
};


// development only
exports.development = function(app){
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
};