var Game_Controller = (function() {
	var mainCanvas = null;
	var compressor = null;
	var player = null;
	var currentLevel = 1;

	var my = {
		win: function() {
			console.log('Win');
			compressor.stop();
			player.win();
			UserAlerts_Tool.showAlert('winner', false);

			setTimeout(function() {
				my.init(currentLevel + 1);
			}, 3000);
		},

		gameOver: function() {
			console.log('GameOver');
			UserAlerts_Tool.showAlert('loser', false);
			compressor.stop();
			player.gameOver();

			setTimeout(function() {
				my.init(currentLevel);
			}, 3000);
		},

		init: function (inLevel) {
			mainCanvas = document.getElementById('main_canvas');
			mainCanvas.innerHTML = '';

			currentLevel = inLevel;
			var levelText = inLevel;

			if (inLevel < 10) {
				levelText = '0' + inLevel;
			}

			var sample = new Text_Tool('level: ' + levelText);
			sample.init(24, 110);

			mainCanvas.classList.add('game_background');

			compressor = new Compressor_Controller(this.win, this.gameOver);
			compressor.init(inLevel);

			player = new Player_Controller(compressor);
			player.init();
		}
	};

	return my;
});
