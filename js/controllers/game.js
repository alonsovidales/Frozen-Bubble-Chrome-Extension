var Game_Controller = (function() {
	var mainCanvas = null;
	var compressor = null;
	var player = null;
	var scoreText = null;
	var currentLevel = 1;
	var currentScore = 0;

	var getLevel = function() {
		var level = localStorage.getItem('lastLevel');
		if (level === null) {
			return 1;
		}

		return parseInt(level, 10);
	};

	var saveLevel = function() {
		localStorage.setItem('lastLevel', currentLevel);
	};

	var setScore = function(inScore) {
		currentScore = inScore;
		scoreText.setText('score: ' + inScore);
	};

	var saveScore = function() {
		localStorage.setItem('totalScore', currentScore);
	};

	var getScore = function() {
		var score = localStorage.getItem('totalScore');
		if (score === null) {
			return 0;
		}

		return parseInt(score, 10);
	};

	var my = {
		addToScore: function(inPoints) {
			setScore(currentScore + inPoints);
		},

		win: function() {
			console.log('Win');
			compressor.stop();
			player.win();
			UserAlerts_Tool.showAlert('winner', false);

			setScore(currentScore + config.scoreBoard.pointsByLevel);
			saveScore();

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

			if (inLevel === undefined) {
				currentLevel = getLevel();
			} else {
				currentLevel = inLevel;
				saveLevel();
			}

			var levelText = currentLevel;
			if (currentLevel < 10) {
				levelText = '0' + currentLevel;
			}

			var levelText = new Text_Tool('level: ' + levelText);
			levelText.init(15, 100);

			scoreText = new Text_Tool();
			scoreText.init(15, 120);

			setScore(getScore());

			mainCanvas.classList.add('game_background');

			compressor = new Compressor_Controller(this.win, this.gameOver, this);
			compressor.init(currentLevel);

			player = new Player_Controller(compressor);
			player.init();
		}
	};

	return my;
});
