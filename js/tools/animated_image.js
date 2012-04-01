var AnimatedImage_Tool = (function(inClass, inStartPosition, inTimeInterval, inNumberOfImages) {
	var divElm = null;
	var moveInfo = null;
	var animationLoop = null;
	var currentPos = inStartPosition;
	var rigthWay = true;
	var timeInterval = inTimeInterval;
	var animationFrom = 0;
	var curentX = 0;
	var curentY = 0;
	var animationTo = inNumberOfImages;
	var animationType = '';
	var movingTo = false;
	var endAnimationCallBack = null;

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
