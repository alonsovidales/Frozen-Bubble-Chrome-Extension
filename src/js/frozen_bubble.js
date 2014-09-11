/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This is the main class who is used as bootstrap of the game,
  * this is a singleton class
  *
  */
var FrozenBubble = (function() {
	return {
		/**
		  * Main method used to launch the execution of the game after all
		  * the DOM elements are loaded
		  *
		  */
		bootstrap: function () {
			window.onload = function () {
				var game = new Game_Controller();
				// You can specify a level in order to test a special level
				game.init();
			};
		}
	};
})();

FrozenBubble.bootstrap();
