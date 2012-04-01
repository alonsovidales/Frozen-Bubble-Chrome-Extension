var BubblesGrid_Controller = (function(inWinFunc, inGameOverFunc) {
	var bubbles = {};
	var bubblesTmp = null;
	var bubblesInGroup = 0;
	var bubblesToRemove = null;
	var baseY = 0;

	var removeBalls = function() {
		console.log('bubblesToRemove');
		console.log(bubblesToRemove);
		var minX = 999999;
		var maxX = 0;

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

		for (bubble in bubblesToRemove) {
			var image = bubblesToRemove[bubble].getImage();
			var bubbleObj = bubblesToRemove[bubble];
			var targetX = 0;
			var targetY = image.getY() - config.bubblesGrid.moveDestroyAnimation;

			if (image.getX() < ((maxX + minX) / 2)) {
				targetX = image.getX() - config.bubblesGrid.moveDestroyAnimation;
			} else {
				targetX = image.getX() + config.bubblesGrid.moveDestroyAnimation;
			}

			bubblesToRemove[bubble].destroy(targetX, targetY);
		}

		if (Object.keys(bubbles).length == 0) {
			inWinFunc();
		}
	};

	var downGroup = function(inParentGroup) {
		var bubblesToAdd = {};

		// Remove the bubbles into the grid bubbles
		for (bubble in inParentGroup) {
			console.log('downGroup ' + bubble);
			console.log(inParentGroup[bubble]);
			bubblesToRemove[bubble] = inParentGroup[bubble].bubble;

			delete bubbles[bubble];
		}

		// Check if each bubble is supported by another one at the top or the laterals
		for (bubble in bubbles) {
			var bubbleToCheck = bubbles[bubble];

			if (
				(bubbleToCheck.row !== 0) &&
				(bubbles[(bubbleToCheck.row) + '-' + (bubbleToCheck.col - 1)] === undefined) &&
				(bubbles[(bubbleToCheck.row) + '-' + (bubbleToCheck.col + 1)] === undefined) &&
				(bubbles[(bubbleToCheck.row - 1) + '-' + (bubbleToCheck.col - 0.5)] === undefined) &&
				(bubbles[(bubbleToCheck.row - 1) + '-' + (bubbleToCheck.col + 0.5)] === undefined)) {

				bubblesToAdd[bubble] = bubbleToCheck;
			}
		}

		// If a new bubble is added to the group, check again the rest of the bubbles
		if (Object.keys(bubblesToAdd).length > 0) {
			downGroup(bubblesToAdd);
		}
	};

	var checkIfExistGroup = function(inBubbleInfo) {
		var currentType = inBubbleInfo.bubble.getType();
		var retBubbles = {};
		for (bubble in bubblesTmp) {
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

	var checkBallOutOfLimits = function(inBubbleInfo) {
		return ((inBubbleInfo.bubble.getImage().getY() + config.bubbles.height) > config.ballsField.bottLeft.y);
	};

	var moveToCell = function(inBubbleInfo, inSlice, inCheckGroup) {
		inBubbleInfo.bubble.getImage().setText(inBubbleInfo.col + ' - ' + inBubbleInfo.row);

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

		// Clone the array
		bubblesTmp = {};
		for (bubble in bubbles) {
			bubblesTmp[bubble] = bubbles[bubble];
		}

		console.log(inCheckGroup);
		if (inCheckGroup) {
			bubblesInGroup = checkIfExistGroup(inBubbleInfo);

			if (Object.keys(bubblesInGroup).length >= config.bubblesGrid.minBubblesToBeConsideredAsGroup) {
				bubblesToRemove = {};
				downGroup(bubblesInGroup);
				removeBalls();
			}
		} else {
			if (checkBallOutOfLimits(inBubbleInfo)) {
				inGameOverFunc();
			}
		}
	};

	var my = {
		checkCollision: function(inBubble) {
			for (bubble in bubbles) {
				if (bubbles[bubble].bubble.getImage().checkCollision(inBubble.getImage(), 'circle')) {
					return bubbles[bubble];
				}
			}

			return false;
		},

		addBubble: function(inBubble, inParentBubble) {
			var col = row = 0;
			var xDesp = 1;

			if (inParentBubble !== false) {
				var desp = 1;
				if (Math.abs(inParentBubble.bubble.getImage().getY() - inBubble.getImage().getY()) < (config.bubbles.height / 3)) {
					row = inParentBubble.row;
				} else {
					desp = 0.5;
					if (inParentBubble.bubble.getImage().getY() < inBubble.getImage().getY()) {
						row = inParentBubble.row + 1;
					} else {
						row = inParentBubble.row - 1;
					}
				}

				if (inParentBubble.bubble.getImage().getX() > inBubble.getImage().getX()) {
					col = inParentBubble.col - desp;
				} else {
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

		setBaseY: function(inY) {
			baseY = inY;

			for (bubble in bubbles) {
				moveToCell(bubbles[bubble], false, false);
			}
		},

		checkIfOutOfLimits: function() {
			for (bubble in bubbles) {
				if (checkBallOutOfLimits(bubbles[bubble])) {
					inGameOverFunc();
					break;
				}
			}
		},

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
