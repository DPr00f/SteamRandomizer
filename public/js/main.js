(function(undefined){
  'use strict';
  // INIT Foundation
  $(document).foundation();
  
  var gamesList,
      rouletteItemHeight = 235,
      $gamesList,
      $jsGames = $('.js-games'),
      $rouletteContainer,
      $roulette,
      currentAppId;

  // Grab the list of games
  if( $jsGames.length ){
    var $jsMeter = $('.js-meter');
    $jsMeter.css({ 'width': 0 });
    $.ajax({
      type: 'GET',
      url: '/games',
      dataType: 'json',
      xhrFields: {
        onprogress: function onProgress(e) {
          if (e.lengthComputable) {
            $jsMeter.css({ 'width': (e.loaded / e.total * 100) + '%' });
          }
        }
      },
      success: function gamesSuccess(data){
        $jsMeter.css({ 'width':'50%' });
        gamesList = data;
        $jsGames.after('<div class="js-games-list"></div>');
        $jsGames.before('<div class="roulette js-roulette"><div class="roulette__items js-roulette-items"></div></div>');
        $jsGames.before('<div class="js-random random-button button large">Pick one for me</div>');
        $roulette = $('.js-roulette');
        $rouletteContainer = $('.js-roulette-items');
        $gamesList = $('.js-games-list');
        renderGames();
        $jsGames.remove();
      }
    });
  }

  function addTitle($container, title){
    $container.append('<h1>' + title + '</h1>');
  }

  function renderRouletteGame(game) {
    var $container = $('<div class="roulette__item" data-game-id="' + game.appId + '"></div>');
    $container.append('<h4 class="roulette__name">' + game.name + '</h4>');
    $container.append('<div class="roulette__image"><img src="' + game.header + '" alt="' + game.name + '"><div class="roulette__veil"></div></div>');
    $container.append('<div class="roulette__total-played">' + game.playtimeForeverReadable + '</div>');
    // $rouletteContainer.append('<fieldset class="switch" tabindex="0">' +
    //                      '<input id="gamePlayed' + game.appId + '" type="checkbox">' +
    //                      '<label for="gamePlayed' + game.appId + '"></label>' +
    //                      '<span class="">Played</span>' +
    //                    '</fieldset>');
    $rouletteContainer.append($container);
    // $rouletteContainer.addClass('is-visible');
    // 
  }

  function showGame(gameId) {
    var itemPosition = 0;
    if(currentAppId === gameId) {
        $roulette.toggleClass('is-visible');
        return;
    }

    currentAppId = gameId;

    itemPosition =  -1 * ($('[data-game-id="' + gameId + '"]:first').index() * rouletteItemHeight);
    $rouletteContainer.animate({
      top: itemPosition + 'px'
    }, 300);

    $('html,body').animate({
       scrollTop: 0
    }, 300);
    
    $roulette.addClass('is-visible');
  }

  function renderGame($container, game){
    var $html;
    if(! game.logo) { return; }
    renderRouletteGame(game);

    $html = $('<div class="steam-game js-game"></div>');
    $html.data('appId', game.appId);
    $html.data('playtimeForeverReadable', game.playtimeForeverReadable);
    $html.append('<img class="steam-game__image" src="' + game.logo + '" alt="' + game.name + '">');
    $html.append('<h5 class="steam-game__name">' + game.name + '</h5>');
    $html.append('<div class="steam-game__total-played">' + game.playtimeForeverReadable + '</div>');
    $container.append($html);
  }
  
  function renderGames(){
    var i;
    addTitle($gamesList, 'Your games');

    for(i = 0; i < gamesList.length; i++) {
      renderGame($gamesList, gamesList[i]);
    }
  }

  $('body').on('click', '.js-game', function(){
    showGame($(this).data('appId'));
  });

})();