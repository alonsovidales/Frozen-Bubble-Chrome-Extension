var FrozenBubble = (function() {
	return {
		bootstrap: function () {
			window.onload = function () {
				var game = new Game_Controller(1, 'Player');
				game.init();
			};
		}
	};
})();
