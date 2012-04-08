/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This class is used to create game elements with animations, move the
  * elements across the screen, etc.
  * The element will be a "div" HTML tag, with the given class. All the styles
  * should be in the corresponding CSS files
  *
  * @param inClass <str>: The class name to add to the div
  * @param inStartPosition <optional int>: The number of the image to show of the spreadsheet on 
  * 	the first representation the number goes from 1 to n
  * @param inTimeInterval <optional int>: The time in ms that should be wait between the images of the animation
  * @param inTimeInterval <optional int>: The total number of images contained into the spreadsheet
  *
  */
var AnimatedImage_Tool = (function(inClass, inStartPosition, inTimeInterval, inNumberOfImages) {
	// Will contain the DOM div element that represents the image
	var divElm = null;
	// Will be an object with the information about the movement if the image is exists any movement
	var moveInfo = null;
	// The timeout that interchanges the images
	var animationLoop = null;
	// The position into the spreadsheet of the current image
	var currentPos = inStartPosition;
	// true if the animation goes from an image to the right images, or false to the left
	var rigthWay = true;
	// The interval in ms to show the diferent pictures into the spreadsheet
	var timeInterval = inTimeInterval;
	// A temp var to store which was the fir image played into an animation
	var animationFrom = 0;
	// The current position into the X axe of the top left corner of the div element
	var curentX = 0;
	// The current position into the Y axe of the top left corner of the div element
	var curentY = 0;
	// The las image to play into the current animation
	var animationTo = inNumberOfImages;
	// Will contain the current animation type, could be:
	//	'circle': after show the last image change the way of the animation,
	//	'loop': after play the last image, play the first one,
	//	'': only play the images into the sequence, and ends with the last image
	var animationType = '';
	// True if a move animation is in course
	var movingTo = false;
	// The function to call after a movement ends
	var endAnimationCallBack = null;

	/**
	  * This method shows an given image of the spreadsheet
	  *
	  * @param inPosition <int>: The position of the image to show from the left of the spreadsheet
	  *
	  */
	var setAnimationImage = function(inPosition) {
		var position = inPosition * divElm.offsetWidth;

		divElm.style.setProperty('background-position', '-' + position + 'px 0px', '!important');
	};

	var animateFrame = function() {
		var stop = false;

		if (rigthWay) {
			currentPos++;
		} else {
			currentPos--;
		}

		if (currentPos == animationTo) {
			switch(animationType) {
				case 'circle':
					rigthWay = false;
					break;

				case 'loop':
					currentPos = animationFrom;
					break;

				default:
					stop = true;
					break;
			}
		}

		if (currentPos == animationFrom) {
			rigthWay = true;
		}

		setAnimationImage(currentPos);

		if (!stop) {
			animationLoop = setTimeout(animateFrame, timeInterval);
		} else {
			if (endAnimationCallBack !== null) {
				endAnimationCallBack();
			}
		}
	};

	var getTangent = function(inX, inY, inTargX, inTargY) {
		return Math.abs(inTargX - inX) / Math.abs(inTargY - inY);
	};

	var moveLoop = function() {
		var distanceX = Math.abs(curentX - moveInfo.targetX);
		var distanceY = Math.abs(curentY - moveInfo.targetY);
		var ang = Math.atan(distanceX / distanceY);

		var nextX = 0;
		var nextY = 0;

		if (curentY > moveInfo.targetY) {
			nextY = curentY - (Math.cos(ang) * moveInfo.steep);
		} else {
			nextY = curentY + (Math.cos(ang) * moveInfo.steep);
		}

		if (curentX > moveInfo.targetX) {
			nextX  = curentX - (Math.sin(ang) * moveInfo.steep);
		} else {
			nextX  = curentX + (Math.sin(ang) * moveInfo.steep);
		}

		my.setPos(nextX, nextY);

		if (
			((Math.abs(moveInfo.targetX - curentX) - moveInfo.steep) <= moveInfo.steep) &&
			((Math.abs(moveInfo.targetY - curentY) - moveInfo.steep) <= moveInfo.steep)) {
			my.setPos(moveInfo.targetX, moveInfo.targetY);

			if ((moveInfo.endMovCallback !== null) && (moveInfo.endMovCallback !== undefined)){
				moveInfo.endMovCallback(my);

				//moveInfo.endMovCallback = null;
			}
		} else {
			moveInfo.movingLoop = setTimeout(moveLoop, moveInfo.loopTime);
		}

		if ((moveInfo.steepCheckFunc !== undefined) && movingTo) {
			if (moveInfo.steepCheckFuncObj !== undefined) {
				moveInfo.steepCheckFunc(moveInfo.steepCheckFuncObj);
			} else {
				moveInfo.steepCheckFunc(my);
			}
		}
	};

	var checkPointInSquare = function(inPoint, inSquare) {
		return (
			(inPoint.x >= inSquare.topLeft.x) &&
			(inPoint.x <= inSquare.bottRight.x) &&
			(inPoint.y >= inSquare.topLeft.y) &&
			(inPoint.y <= inSquare.bottRight.y));
	};

	var getDistanceTwoPoints = function(inPointOne, inPointTwo) {
		var distX = Math.abs(inPointOne.x - inPointTwo.x);
		var distY = Math.abs(inPointOne.y - inPointTwo.y);

		return Math.sqrt((distX * distX) + (distY * distY));
	};

	var my = {
		hide: function() {
			divElm.classList.add('hd');
		},

		show: function() {
			setAnimationImage(inStartPosition);
			divElm.classList.remove('hd');
		},

		getX: function() {
			return curentX;
		},

		getY: function() {
			return curentY;
		},

		getWidth: function() {
			return divElm.offsetWidth;
		},

		getHeight: function() {
			return divElm.offsetHeight;
		},

		checkCollision: function(inElemToCheck, inType) {
			if ((inType !== undefined) && (inType == 'circle')) {
				var radThis = my.getWidth() / 2;
				var radCheck = inElemToCheck.getWidth() / 2;
				var centerThis = {
					x: my.getX() - radThis,
					y: my.getY() - radThis};
				var centerCheck = {
					x: inElemToCheck.getX() - radCheck,
					y: inElemToCheck.getY() - radCheck};

				return ((radThis + radCheck) >= getDistanceTwoPoints(centerThis, centerCheck));

				return false;
			} else {
				var square = {
					topLeft: {
						x: my.getX(),
						y: my.getY()
					},
					bottRight: {
						x: my.getX() + my.getWidth(),
						y: my.getY() + my.getHeight()
					}
				};

				var topLeft = {x: inElemToCheck.getX(), y: inElemToCheck.getY()};
				var topRight = {x: inElemToCheck.getX() + inElemToCheck.getWidth(), y: inElemToCheck.getY()};
				var bottLeft = {x: inElemToCheck.getX(), y: inElemToCheck.getY() + inElemToCheck.getHeight()};
				var bottRight = {x: inElemToCheck.getX() + inElemToCheck.getWidth(), y: inElemToCheck.getY() + inElemToCheck.getHeight()};

				return (
					checkPointInSquare(topLeft, square) ||	
					checkPointInSquare(topRight, square) ||
					checkPointInSquare(bottLeft, square) ||
					checkPointInSquare(bottRight, square));
			}
		},

		setText: function(inText) {
			divElm.innerHTML = inText;
		},

		setPos: function(inX, inY) {
			curentX = inX;
			curentY = inY;
			divElm.style.setProperty('top', inY + 'px', '!important');
			divElm.style.setProperty('left', inX + 'px', '!important');
		},

		setClass: function(inNewClass) {
			divElm.classList.add(inNewClass);
		},

		animate: function(inParams) {
			this.stopAnimation();

			animationType = inParams.type;

			if (inParams.from !== undefined) {
				currentPos = inParams.from;
				animationFrom = inParams.from;
			}

			if (inParams.to !== undefined) {
				animationTo = inParams.to;
			} else {
				animationTo = inNumberOfImages;
			}

			rigthWay = (inParams.to === undefined) || (inParams.from < inParams.to);

			if (inParams.localTimeInterval !== undefined) {
				timeInterval = inLocalTimeInterval;
			}

			if (inParams.callback !== undefined) {
				endAnimationCallBack = inParams.callback;
			}

			animateFrame();
		},

		rotate: function(inDeg) {
			divElm.style.setProperty('-webkit-transform', 'rotate(' + inDeg + 'deg)', '!important');
		},

		stop: function() {
			movingTo = false;
			clearTimeout(moveInfo.movingLoop);
		},

		moveTo: function(inX, inY, inLoopTime, inCallBack, inSteepPx, inSteepCheckFunc, inSteepCheckFuncObj) {
			movingTo = true;
			if ((moveInfo !== null) && (moveInfo.movingLoop !== undefined)) {
				clearTimeout(moveInfo.movingLoop);
			}

			moveInfo = {
				origTan: getTangent(curentX, curentY, inX, inY),
				targetX: inX,
				targetY: inY,
				steep: inSteepPx,
				loopTime: inLoopTime,
				steepCheckFunc: inSteepCheckFunc,
				steepCheckFuncObj: inSteepCheckFuncObj,
				endMovCallback: inCallBack};

                        moveLoop();
		},

		stopAnimation: function() {
			if (animationLoop !== null) {
				currentPos = inStartPosition;
				setAnimationImage(inStartPosition);

				clearTimeout(animationLoop);

				animationLoop = null;
				endAnimationCallBack = null;
			}
		},

		init: function() {
			var mainCanvas = document.getElementById(config.gameCanvas.id);

			divElm = document.createElement("div");
			divElm.classList.add(inClass);

			mainCanvas.appendChild(divElm);

			if (currentPos === undefined) {
				currentPos = 0;
			}
		}
	}

	return my;
});
