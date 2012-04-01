var FrozenBubble = (function() {
	return {
		bootstrap: function () {
			window.onload = function () {
				var game = new Game_Controller();
				game.init(1);
			};
		}
	};
})();
