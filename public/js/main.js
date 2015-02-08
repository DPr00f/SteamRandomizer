(function(undefined){
  "use strict";
  var gamesList,
    $gamesList,
    $jsGames = $('.js-games'),
    $singleGame;

  // Grab the list of games
  if( $jsGames.length ){
    var $jsMeter = $('.js-meter');
    $jsMeter.css({ 'width': 0 });
    $.ajax({
      type: 'GET',
      url: "/games",
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
        $jsGames.before('<div class="js-single-game single-game"></div>');
        $singleGame = $('.js-single-game');
        $gamesList = $('.js-games-list');
        renderGames();
        $jsGames.remove();
      }
    });
  }

  function addTitle($container, title){
    $container.append('<h1>' + title + '</h1>');
  }

  function renderSingleGame() {
    var $el = $(this);

  }

  function renderGame($container, game){
    if(! game.logo) { return; }
    var $html = $('<div class="steam-game js-game"></div>');
    $html.data('header', game.header);
    $html.append('<img class="steam-game__image" src="' + game.logo + '" alt="' + game.name + '">');
    $html.append('<h5 class="steam-game__name">' + game.name + '</h5>');
    $html.append('<div class="steam-game__total-played">' + game.playtimeForeverReadable + '</div>');
    // $html.append('<fieldset class="switch" tabindex="0">' +
    //                 '<input id="gamePlayed' + game.appId + '" type="checkbox">' +
    //                 '<label for="gamePlayed' + game.appId + '"></label>' +
    //                 '<span class="">Played</span>' +
    //               '</fieldset>');
    $container.append($html);
  }
  
  function renderGames(){
    var i;
    addTitle($gamesList, 'Your games');

    for(i = 0; i < gamesList.length; i++) {
      renderGame($gamesList, gamesList[i]);
    }

    $('body').on('click', '.js-game', function(){
      renderSingleGame.call(this);
    });

  };
})();