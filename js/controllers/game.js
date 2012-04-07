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
	  * This method shows the game credits over a wood background
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
		/**
		  * This method adds a score to the current score, and shows it
		  * into the scoreboard
		  *
		  * @param inPoints <int>: The number of points to add
		  *
		  */
		addToScore: function(inPoints) {
			setScore(currentScore + inPoints);
		},

		/**
		  * This method should be called after the game ends and if the user wins
		  * and alert with the winner text is shown, ths score is updated, and a new level
		  * is created after tree seconds, if the user is at the last level, the alerts gives
		  * the option of restart all the game
		  *
		  * @see Compressor_Controller: stop method
		  * @see Player_Controller: win method
		  *
		  */
		win: function() {
			compressor.stop();
			player.win();

			setScore(currentScore + config.scoreBoard.pointsByLevel);
			saveScore();

			// Check if the user is at the last level
			if (currentLevel == config.game.totalLevels) {
				UserAlerts_Tool.showAlert('winner_last_level', false, 'restart game', my.resetAll);
			} else {
				// Show the alert, wait tree seconds, and launch the next level
				UserAlerts_Tool.showAlert('winner', false);

				// Wait for tree seconds, and launch the next level
				setTimeout(function() {
					my.init(currentLevel + 1);
				}, 3000);
			}
		},

		/**
		  * This method should be called after the game ends and if is a losing game
		  * This method shows the loser alert message, stops the compessor, and the player events, and 
		  * relaunch the current level after wait tree seconds.
		  *
		  * @see Compressor_Controller: gameOver method
		  * @see Player_Controller: gameOver method
		  */
		gameOver: function() {
			UserAlerts_Tool.showAlert('loser', false);
			compressor.gameOver();
			player.gameOver();

			// Wait for tree seconds, and relaunch the level
			setTimeout(function() {
				my.init(currentLevel);
			}, 3000);
		},

		/**
		  * This method removes all the information from localStorage, and
		  * relaunchs the game, the user will feel that all the game is reset,
		  * the current level, current score, etc
		  *
		  */
		resetAll: function() {
			localStorage.clear();
			my.init();
		},

		/**
		  * This method creates a new level, and executes all the necessary code to
		  * creates all the elemnts for the level
		  *
		  * @param inLevel (optional) <int>: The Number of the level to init if you
		  *	don't specify it the level will be the last played, and if the user
		  *	didn't play before, the level will be the first one
		  *
		  */
		init: function (inLevel) {
			// Remove all the element into the main canvas
			mainCanvas = document.getElementById('main_canvas');
			mainCanvas.innerHTML = '';
			mainCanvas.classList.add('game_background');

			// If is not level specify, get the last one played, or the fisrt one
			if (inLevel === undefined) {
				currentLevel = getLevel();
			} else {
				currentLevel = inLevel;
				saveLevel();
			}

			// Set the new text, and pad with a 0 if is a single number level
			var levelText = currentLevel;
			if (currentLevel < 10) {
				levelText = '0' + currentLevel;
			}
			var levelText = new Text_Tool('level: ' + levelText);
			levelText.init(config.scoreBoard.x, config.scoreBoard.y);

			// Show the score into the scoreboard and save it
			scoreText = new Text_Tool();
			scoreText.init(config.scoreBoard.x, config.scoreBoard.y + 20);
			setScore(getScore());

			// Launch the compressor
			compressor = new Compressor_Controller(this.win, this.gameOver, this);
			compressor.init(currentLevel);

			// Launch the player, images, events, etc.
			player = new Player_Controller(compressor);
			player.init();

			showCredits();
		}
	};

	return my;
});
