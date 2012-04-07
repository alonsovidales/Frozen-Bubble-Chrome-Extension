/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-27
  *
  * This class is used to handle all the features of the compressor
  *
  * @see config.compressor
  * @see AnimatedImage_Tool
  *
  * @param inWinFunc <function>: The function to be called if is detected that
  *	the user wins the game
  * @param inGameOverFunc <function>: The function to be called if is detected that
  *	the user lose the game
  * @param inGameController <object>: Game_Controller object
  *
  */
var Compressor_Controller = (function(inWinFunc, inGameOverFunc, inGameController) {
	// Will contain the BubblesGrid_Controller object
	var bubblesGrid = null;
	// Will contain the AnimatedImage_Tool object of the compressor
	var compressorImg = null;
	// The current position of the compressor
	var currentPos = 1;
	// This timeout controls the advance of the compressor
	var compressorMainTimeout = null;
	// The current game level
	var level = 1;

	/**
	  * This method is called to advance one position the compressor, moves too all the
	  * bubbles of the bubbles grid
	  *
	  */
	var advance = function() {
		SoundManager_Tool.play(config.compressor.newRootSnd);

		// Creates a new extensor to be added to the string of extensors
		var extensor = new AnimatedImage_Tool('compressor_extender');
		extensor.init();
		extensor.setPos(config.compressor.extensor.x, ((currentPos - 1) * config.compressor.extensor.height));
		extensor.show();

		// Move the compressor one position, and the bubbles grid too
		compressorImg.setPos(config.compressor.x, config.compressor.initY + (currentPos * config.compressor.extensor.height));
		bubblesGrid.setBaseY((currentPos * config.compressor.extensor.height) + config.compressor.initY + config.compressor.height);
		currentPos++;

		compressorMainTimeout = setTimeout(
			advance,
			config.compressor.baseLoopTime - (level * config.compressor.timeToDecreaseByLevel));

		// Check if at least one of the bubbles rise the bottom limit
		if (bubblesGrid.checkIfOutOfLimits()) {
			inGameOverFunc();
		}
	};

	// Public scope
	return {
		/**
		  * This method stops the movement of the compressor
		  *
		  */
		stop: function() {
			clearTimeout(compressorMainTimeout);
		},

		/**
		  * This method should be called when the game ends and the user
		  * lost the game
		  *
		  */
		gameOver: function() {
			bubblesGrid.frozeAllTheBubbles();
			clearTimeout(compressorMainTimeout);
		},

		/**
		  * Check if a bubble crash against any of the bubbles of the grid, or the compressor
		  * and adds the bubble to the bubbles grid in this case
		  *
		  * @param inBubble <object>: The Bullble_Controller object to be checked
		  *
		  */
		checkCollision: function(inBubble) {
			var bubbleCollision = bubblesGrid.checkCollision(inBubble);
			if (
				(bubbleCollision !== false) ||
				compressorImg.checkCollision(inBubble.getImage())) {
				inBubble.stop();

				bubblesGrid.addBubble(inBubble, bubbleCollision);
			}
		},

		/**
		  * This is the method to be called after the object is created in order to initialize all the
		  * different elements. This method creates the animted image, set the initial position for it
		  * and starts the loop to move the compressor
		  *
		  * @param inLevel <int>: The current game level
		  *
		  * @see js/level_temp/levels.js : The levels definition file
		  *
		  */
		init: function(inLevel) {
			level = inLevel;
			bubblesGrid = new BubblesGrid_Controller(inWinFunc, inGameOverFunc, inGameController);

			// Iinit the image object to create the element
			compressorImg = new AnimatedImage_Tool('compressor');
			compressorImg.init();
			compressorImg.show();
			advance();

			// Read the current level from the levels file and adds all the bubbles to the positions
			var bubbles = levels[inLevel];
			for (bubble in bubbles) {
				bubbles[bubble].bubble = new Bullble_Controller(
					config.windowConf.width / 2,
					config.windowConf.width / 2);
			}

			bubblesGrid.init(levels[inLevel]);
		}
	}
});
