/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This class is used to control all the game features level by level
  *
  * @see config.game
  *
  */
var Game_Controller = (function() {
	// Will contain the main canvas div element
	var mainCanvas = null;
	// Will contain the Compressor_Controller object
	var compressor = null;
	// Will contain the Player_Controller object
	var player = null;
	// Will contain the Text_Tool object for the score
	var scoreText = null;
	// The number of the current level will be stored and initialized into localStorage
	var currentLevel = 1;
	// The the current score will be stored and initialized into localStorage
	var currentScore = 0;

	/**
	  * This method will return the last played level from localStorage, or 1 if is not defined
	  *
	  */
	var getLevel = function() {
		var level = localStorage.getItem('lastLevel');
		if (level === null) {
			return 1;
		}

		return parseInt(level, 10);
	};

	/**
	  * This method store the current level into localStorage
	  *
	  */
	var saveLevel = function() {
		localStorage.setItem('lastLevel', currentLevel);
	};

	/**
	  * Adds the inScore points to the current score and updates the score text
	  *
	  * @param inScore <int>: The points to add to the current score
	  *
	  */
	var setScore = function(inScore) {
		currentScore = inScore;
		scoreText.setText('score: ' + inScore);
	};

	/**
	  * This method store the current score into localStorage
	  *
	  */
	var saveScore = function() {
		localStorage.setItem('totalScore', currentScore);
	};

	/**
	  * This method return from localStorage the last score, or zero if
	  * it is not defined
	  *
	  */
	var getScore = function() {
		var score = localStorage.getItem('totalScore');
		if (score === null) {
			return 0;
		}

		return parseInt(score, 10);
	};

	/**
	  * This method shows the game credits into a wood box
	  *
	  */
	var showCredits = function() {
		// Creates the wood background
		var backgroundDiv = document.createElement("div");
		backgroundDiv.classList.add('credits_background');
		mainCanvas.appendChild(backgroundDiv);

		// Creates the text and adds the link
		var credits = new Text_Tool('created by:');
		credits.init(18, 437);
		credits = new Text_Tool('alonso vidales');
		credits.init(18, 457);
		credits.addLink(function (){
			chrome.tabs.create({'url': config.cvLink});
			window.close();
		});
	};

	// Public scope
	var my = {
		addToScore: function(inPoints) {
			setScore(currentScore + inPoints);
		},

		win: function() {
			compressor.stop();
			player.win();

			setScore(currentScore + config.scoreBoard.pointsByLevel);
			saveScore();

			if (currentLevel == config.game.totalLevels) {
				UserAlerts_Tool.showAlert('winner_last_level', false, 'restart game', my.resetAll);
			} else {
				UserAlerts_Tool.showAlert('winner', false);

				setTimeout(function() {
					my.init(currentLevel + 1);
				}, 3000);
			}
		},

		gameOver: function() {
			UserAlerts_Tool.showAlert('loser', false);
			compressor.gameOver();
			player.gameOver();

			setTimeout(function() {
				my.init(currentLevel);
			}, 3000);
		},

		resetAll: function() {
			localStorage.clear();
			my.init();
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
			levelText.init(config.scoreBoard.x, config.scoreBoard.y);

			scoreText = new Text_Tool();
			scoreText.init(config.scoreBoard.x, config.scoreBoard.y + 20);

			setScore(getScore());

			mainCanvas.classList.add('game_background');

			compressor = new Compressor_Controller(this.win, this.gameOver, this);
			compressor.init(currentLevel);

			player = new Player_Controller(compressor);
			player.init();

			showCredits();
		}
	};

	return my;
});
