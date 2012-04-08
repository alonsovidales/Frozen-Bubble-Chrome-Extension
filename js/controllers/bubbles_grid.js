/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-27
  *
  * This class is used to handle all the features of the bubbles grid
  * at the bottom of the compressor
  *
  * @see config.bubblesGrid
  * @see Bullble_Controller
  *
  * @param inWinFunc <function>: The function to be called if is detected that
  *	the user wins the game
  * @param inGameOverFunc <function>: The function to be called if is detected that
  *	the user lose the game
  * @param inGameController <object>: Game_Controller object
  *
  */
var BubblesGrid_Controller = (function(inWinFunc, inGameOverFunc, inGameController) {
	// This object will be used as a dictionary and will contain all the bubble in the grid
	// The key for each bubble will have the next structure: [bubble.row + '-' + bubble.col]
	var bubbles = {};
	var bubblesTmp = null;
	// The number of bubble in a group when a crash is detected
	var bubblesInGroup = null;
	// The bubbles to be removed after a group is created by a crash
	var bubblesToRemove = null;
	// The number of pixels for the Y axe that the bubbles will have as top
	var baseY = 0;

	/**
	  * This method will create the animation to remove, and remove all the bubbles inside the 
	  * bubblesToRemove object
	  */
	var removeBalls = function() {
		// 999999 === Infinity
		var minX = 999999;
		var maxX = 0;

		// Add to the score the number of bubbles to temove by the number of points that the
		// user obtains for each bubble
		inGameController.addToScore(Object.keys(bubblesToRemove).length * config.scoreBoard.pointsByBubble);

		// Calculate the max and min pixels of the X axe in order to create the animation to
		// show before remove the bubbles
		for (bubble in bubblesToRemove) {
			var image = bubblesToRemove[bubble].getImage();

			if (image.getX() < minX) {
				minX = image.getX();
			} else {
				if (image.getX() > maxX) {
					maxX = image.getX();
				}
			}
		}

		SoundManager_Tool.play(config.bubblesGrid.destroyGroupSnd);

		for (bubble in bubblesToRemove) {
			var image = bubblesToRemove[bubble].getImage();
			var bubbleObj = bubblesToRemove[bubble];
			var targetX = 0;
			var targetY = image.getY() - config.bubblesGrid.moveDestroyAnimation;

			// If the bubble is at the left of the middle of the group move it to the left, and viceversa
			if (image.getX() < ((maxX + minX) / 2)) {
				targetX = image.getX() - config.bubblesGrid.moveDestroyAnimation;
			} else {
				targetX = image.getX() + config.bubblesGrid.moveDestroyAnimation;
			}

			bubblesToRemove[bubble].destroy(targetX, targetY);
		}

		// If there is no bubbles, the user wins
		if (Object.keys(bubbles).length == 0) {
			inWinFunc();
		}
	};

	/**
	  * This method check if a bubble is supported by any other bubble, or is not in order to know
	  * if a bubbe is removable, or not
	  * This is a recursive method, check is a bubble is supported if at least on of the collider
	  * bubbles are supported
	  *
	  * @param inBubbleInfo <object>: an object with the next structure:
	  *	{
	  *		row: <int>, // The row where the bubble is allocated
	  *		col: <int>, // The column where the bubble is allocated
	  *		bubble: <object> // Bullble_Controller object that represents the bubble }
	  * @param inRightCheck <bool>: If true check if the bubble is supported by the right, if false by the left
	  *
	  * @return <bool>: Returns true if the bubble is supported, false if not
	  *
	  */
	var isBubbleSupported = function(inBubbleInfo, inRightCheck) {
		// Get the possible bubbles that supports this one
		var bubbleAtLateral = bubbles[(inBubbleInfo.row) + '-' + (inBubbleInfo.col - 1)];
		if (inRightCheck) {
			bubbleAtLateral = bubbles[(inBubbleInfo.row) + '-' + (inBubbleInfo.col + 1)];
		}
		var bubbleTopLeft = bubbles[(inBubbleInfo.row - 1) + '-' + (inBubbleInfo.col - 0.5)];
		var bubbleTopRight = bubbles[(inBubbleInfo.row - 1) + '-' + (inBubbleInfo.col + 0.5)];

		// Check if one of the bubbles sopports the current one, and in any bubble exists return true, false if not
		return (
			(inBubbleInfo.row === 0) ||
			(bubbleTopLeft !== undefined) ||
			(bubbleTopRight !== undefined) ||
			((bubbleAtLateral !== undefined) && isBubbleSupported(bubbleAtLateral, inRightCheck)));
	};

	/**
	  * This method check if a bubble is supported by any other bubble, or is not in order to know
	  * if a bubbe is removable, or not
	  * This is a recursive method, check is a bubble is supported if at least on of the collider
	  * bubbles are supported
	  *
	  * @param inBubbleInfo <object>: an object with the next structure:
	  *	{
	  *		row: <int>, // The row where the bubble is allocated
	  *		col: <int>, // The column where the bubble is allocated
	  *		bubble: <object> // Bullble_Controller object that represents the bubble }
	  * @param inRightCheck <bool>: If true check if the bubble is supported by the right, if false by the left
	  *
	  * @return <bool>: Returns true if the bubble is supported, false if not
	  *
	  */
	var downGroup = function(inParentGroup) {
		var bubblesToAdd = {};

		// Remove the bubbles into the grid bubbles
		for (bubble in inParentGroup) {
			bubblesToRemove[bubble] = inParentGroup[bubble].bubble;

			delete bubbles[bubble];
		}

		// Check if each bubble is supported by another one at the top or the laterals
		for (bubble in bubbles) {
			var bubbleToCheck = bubbles[bubble];

			if (!isBubbleSupported(bubbles[bubble], true) && !isBubbleSupported(bubbles[bubble], false)) {
				bubblesToAdd[bubble] = bubbleToCheck;
			}
		}

		// If a new bubble is added to the group, check again the rest of the bubbles
		if (Object.keys(bubblesToAdd).length > 0) {
			downGroup(bubblesToAdd);
		}
	};

	/**
	  * This method Checks if after a bubble crash, this crash has created a new group (adjacent bubbles
	  * with the same type), and returns an object with all the bubbles
	  * Important: The internal var bubblesTmp should contain an exact copy of the bubbles internal var
	  * before call this method, this methos works directly modifying the bubblesTmp var
	  *
	  * @param inBubbleInfo <object>: The new bubble added than can create the group, there is an object
	  *	with the next structure:
	  *		{
	  *			row: <int>, // The row where the bubble is allocated
	  *			col: <int>, // The column where the bubble is allocated
	  *			bubble: <object> // Bullble_Controller object that represents the bubble }
	  *
	  * @return <object>: An object of objects with the same structure as inBubbleInfo and with
	  *	[row + '-' + col] as key
	  *
	  */
	var checkIfExistGroup = function(inBubbleInfo) {
		var currentType = inBubbleInfo.bubble.getType();
		var retBubbles = {};
		for (bubble in bubblesTmp) {
			// Check if exist one of the adjacent bubbles have the same type, and in this
			// case add it to the group and remove from bubblesTmp
			if (
				(bubblesTmp[bubble] !== null) &&
				(bubblesTmp[bubble].bubble.getType() == currentType) && 
				(Math.abs(bubblesTmp[bubble].col - inBubbleInfo.col) <= 1) && 
				(Math.abs(bubblesTmp[bubble].row - inBubbleInfo.row) <= 1)) {

				retBubbles[bubble] = bubblesTmp[bubble];
				bubblesTmp[bubble] = null;

				var deepBubbles = checkIfExistGroup(retBubbles[bubble]);

				for (deepBubble in deepBubbles) {
					retBubbles[deepBubble] = deepBubbles[deepBubble];
				}
			}
		}

		return retBubbles;
	};

	/**
	  * This method checks if the given ball is out of the limits (under the bottom limit)
	  *
	  * @param inBubbleInfo <object>: The bubble to check is is out of limits. Is an object with the next structure:
	  *		{
	  *			row: <int>, // The row where the bubble is allocated
	  *			col: <int>, // The column where the bubble is allocated
	  *			bubble: <object> // Bullble_Controller object that represents the bubble }
	  *
	  * @return <bool>: True if is out, or false if not
	  *
	  */
	var checkBallOutOfLimits = function(inBubbleInfo) {
		return ((inBubbleInfo.bubble.getImage().getY() + config.bubbles.height) > config.ballsField.bottLeft.y);
	};

	/**
	  * This method moves a bubble to the nearby grid cell, and launch all the checks to know if one of the bubbles are
	  * out of limits (game over) or all the bubbles are removed (player wins)
	  *
	  * @param inBubbleInfo <object>: The bubble info to move
	  *		{
	  *			row: <int>, // The row where the bubble is allocated
	  *			col: <int>, // The column where the bubble is allocated
	  *			bubble: <object> // Bullble_Controller object that represents the bubble }
	  * @param inSlice <bool>: True if the bubble should be moves slicing, or is a direct movement
	  * @param inCheckGroup <bool>: True if should be checked if exist any group (user added bubble) or false
	  *	if shouldn't be checked (added by the system at the begging of the level)
	  *
	  */
	var moveToCell = function(inBubbleInfo, inSlice, inCheckGroup) {
		// Add the col and row texts over the bubble image
		if (config.debug) {
			inBubbleInfo.bubble.getImage().setText(inBubbleInfo.col + ' - ' + inBubbleInfo.row);
		}

		// Calculate the cell pos, and move the bubble to the corresponding cell
		if (inSlice) {
			inBubbleInfo.bubble.getImage().moveTo(
				(inBubbleInfo.col * config.bubbles.width) + config.bubblesGrid.x,
				(inBubbleInfo.row * (config.bubbles.height - config.bubblesGrid.heightCorrection)) + baseY,
				config.bubbles.loopTime,
				null,
				config.bubbles.steepPx);
		} else {
			inBubbleInfo.bubble.getImage().setPos(
				(inBubbleInfo.col * config.bubbles.width) + config.bubblesGrid.x,
				(inBubbleInfo.row * (config.bubbles.height - config.bubblesGrid.heightCorrection)) + baseY);
		}

		// Clone the bubbles array to bubblesTmp
		bubblesTmp = {};
		for (bubble in bubbles) {
			bubblesTmp[bubble] = bubbles[bubble];
		}

		if (inCheckGroup) {
			// Get le list of bubbles inside the group of the nuw added bubble
			bubblesInGroup = checkIfExistGroup(inBubbleInfo);

			if (Object.keys(bubblesInGroup).length >= config.bubblesGrid.minBubblesToBeConsideredAsGroup) {
				bubblesToRemove = {};
				downGroup(bubblesInGroup);
				removeBalls();
			} else {
				SoundManager_Tool.play(config.bubblesGrid.stickBubbleSnd);

				if (checkBallOutOfLimits(inBubbleInfo)) {
					inGameOverFunc();
				}
			}
		}
	};

	// Public scope
	var my = {
		/**
		  * This method check if a given bubble crash againsth the bubbles grid
		  * and returns true in that case
		  *
		  * @param inBubble <object>: The Bullble_Controller object to be checked
		  *
		  * @return <bool>: True if exists a collision, false if not
		  *
		  */
		checkCollision: function(inBubble) {
			for (bubble in bubbles) {
				if (bubbles[bubble].bubble.getImage().checkCollision(inBubble.getImage(), 'circle')) {
					return bubbles[bubble];
				}
			}

			return false;
		},

		/**
		  * This method add a bubble to the corresponding cell after a collision
		  * with another bubble is detected
		  *
		  * @param inBubble <object>: The Bullble_Controller object to be checked
		  * @param inParentBubble <object>: The bubble who the bubble to add has creashed
		  *
		  */
		addBubble: function(inBubble, inParentBubble) {
			var col = row = 0;
			var xDesp = 1;

			// Check if the bubble crash against another bubble, or against the compressor
			if (inParentBubble !== false) {
				var desp = 1;
				if (Math.abs(inParentBubble.bubble.getImage().getY() - inBubble.getImage().getY()) < (config.bubbles.height / 3)) {
					// The collision is at a lateral of the parent bubble
					row = inParentBubble.row;
				} else {
					desp = 0.5;
					if (inParentBubble.bubble.getImage().getY() < inBubble.getImage().getY()) {
						// The collision is at the bottom of the parent bubble
						row = inParentBubble.row + 1;
					} else {
						// The collision is at the top of the parent bubble
						row = inParentBubble.row - 1;
					}
				}

				if (inParentBubble.bubble.getImage().getX() > inBubble.getImage().getX()) {
					// The collision is at the left of the parent bubble
					col = inParentBubble.col - desp;
				} else {
					// The collision is at the left of the right bubble
					col = inParentBubble.col + desp;
				}
			} else {
				col = Math.round((inBubble.getImage().getX() - config.bubblesGrid.x) / config.bubbles.width);
			}

			var bubble = {
				row: row,
				col: col,
				bubble: inBubble};

			bubbles[row + '-' + col] = bubble;
			moveToCell(bubble, false, true);
		},

		/**
		  * This method moves all the bubbles grid to a determinate position in pixels into the Y axe
		  *
		  * @param inY <int>: The number of pixels from the top os the window to set the top os the grid
		  *
		  */
		setBaseY: function(inY) {
			baseY = inY;

			for (bubble in bubbles) {
				moveToCell(bubbles[bubble], false, false);
			}
		},

		/**
		  * This method check if one of the bubbles if out of the bottom limit, and in that case launchs the
		  * "inGameOverFunc" function in order to end the game
		  *
		  */
		checkIfOutOfLimits: function() {
			for (bubble in bubbles) {
				if (checkBallOutOfLimits(bubbles[bubble])) {
					inGameOverFunc();
					break;
				}
			}
		},

		/**
		  * This method goes bubble by bubble adding the "frozen" mask to create the effect
		  *
		  */
		frozeAllTheBubbles: function() {
			for (bubble in bubbles) {
				bubbles[bubble].bubble.froze();
			}
		},

		/**
		  * This method should be called after all the DOM elements are rendered, and creates the initial
		  * bubbles grid from the corresponding level object.
		  *
		  * @see js/level_temp/levels.js
		  *
		  */
		init: function(initBubbles) {
			for (bubble in initBubbles) {
				initBubbles[bubble].bubble.init();
				moveToCell(initBubbles[bubble], true, false);
			}

			for (bubble in initBubbles) {
				bubbles[initBubbles[bubble].row + '-' + initBubbles[bubble].col] = initBubbles[bubble];
			}
		}
	};

	return my;
});
