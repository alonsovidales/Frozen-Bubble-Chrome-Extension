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
	  * This method shows the corresponding image of the spreadsheet
	  *
	  * @param inPosition <int>: The position of the image to show from the left of the spreadsheet
	  *
	  */
	var setAnimationImage = function(inPosition) {
		var position = inPosition * divElm.offsetWidth;

		divElm.style.setProperty('background-position', '-' + position + 'px 0px', '!important');
	};

	/**
	  * Creates an animation loop using the config parameters configured on the
	  * "animate" method of the public scope, this method should be called from the "animate"
	  * method only
	  *
	  */
	var animateFrame = function() {
		var stop = false;

		// Move the pointer to the image to show according to the current animation way
		if (rigthWay) {
			currentPos++;
		} else {
			currentPos--;
		}

		// Is the animation finished?
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

		setAnimationImage(currentPos);

		if (!stop) {
			animationLoop = setTimeout(animateFrame, timeInterval);
		} else {
			if (endAnimationCallBack !== null) {
				endAnimationCallBack();
			}
		}
	};

	/**
	  * Returns the tangegent os the angle that forms the tringle rectangle which
	  * hipotenusa is defined by the two given points
	  *
	  * @param inX <int>: The width in pixels of the X axe from the origin for the main point
	  * @param inY <int>: The width in pixels of the Y axe from the origin for the main point
	  * @param inTargX <int>: The width in pixels of the X axe from the origin for the second point
	  * @param inTargY <int>: The width in pixels of the Y axe from the origin for the second point
	  *
	  * @return <int>: The tangent
	  *
	  */
	var getTangent = function(inX, inY, inTargX, inTargY) {
		return Math.abs(inTargX - inX) / Math.abs(inTargY - inY);
	};

	/**
	  * This method is called to create the animation of the element movement
	  *
	  */
	var moveLoop = function() {
		// Calculate the triangle rectangle cathetus
		var distanceX = Math.abs(curentX - moveInfo.targetX);
		var distanceY = Math.abs(curentY - moveInfo.targetY);
		// The angle in radians
		var ang = Math.atan(distanceX / distanceY);

		// Will allocate the X and Y points where the element will be moved
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

		// Check if the distance to the objective is less than a steep, in that case, move the element and
		// ends the movement calling to the callback function if is defined
		if (
			((Math.abs(moveInfo.targetX - curentX) - moveInfo.steep) <= moveInfo.steep) &&
			((Math.abs(moveInfo.targetY - curentY) - moveInfo.steep) <= moveInfo.steep)) {
			my.setPos(moveInfo.targetX, moveInfo.targetY);

			if ((moveInfo.endMovCallback !== null) && (moveInfo.endMovCallback !== undefined)){
				moveInfo.endMovCallback(my);
			}
		} else {
			moveInfo.movingLoop = setTimeout(moveLoop, moveInfo.loopTime);
		}

		// Check if isset a function that should be called each steep, and call it in this case
		if ((moveInfo.steepCheckFunc !== undefined) && movingTo) {
			if (moveInfo.steepCheckFuncObj !== undefined) {
				moveInfo.steepCheckFunc(moveInfo.steepCheckFuncObj);
			} else {
				moveInfo.steepCheckFunc(my);
			}
		}
	};

	/**
	  * This method returns a boolean true in case that a given point obkect is in a
	  * square defined by the top left corner, and le bottom right corners points
	  *
	  * @param inPoint <object>: The point to check with the next structure:
	  *	{
	  *		x: <int>, // The pixels of the X axe of the point
	  *		y: <int>} // The pixels of the Y axe of the point
	  * @param inSquare <object>: The points of the top left and bottom right that
	  *	defines the square:
	  *	{
	  *		topLeft: { // The top left point
	  *			x: <int>, // The pixels of the X axe of the point
	  *			y: <int>}, // The pixels of the Y axe of the point
	  *		bottRight: { // The botton right point
	  *			x: <int>, // The pixels of the X axe of the point
	  *			y: <int>}} // The pixels of the Y axe of the point
	  *
	  * @return <bool>: True if the point is inside the square, or false if not
	  *
	  */
	var checkPointInSquare = function(inPoint, inSquare) {
		return (
			(inPoint.x >= inSquare.topLeft.x) &&
			(inPoint.x <= inSquare.bottRight.x) &&
			(inPoint.y >= inSquare.topLeft.y) &&
			(inPoint.y <= inSquare.bottRight.y));
	};

	/**
	  * This method uses the Pitagoras theorem in order to calculate the length of
	  * hipotenusa that defines the two points, then calculates the distance between
	  * the two points
	  *
	  * @param inPointOne <object>: One of the points
	  *	{
	  *		x: <int>, // The pixels of the X axe of the point
	  *		y: <int>} // The pixels of the Y axe of the point
	  * @param inPointTwo <object>: The other point
	  *	{
	  *		x: <int>, // The pixels of the X axe of the point
	  *		y: <int>} // The pixels of the Y axe of the point
	  */
	var getDistanceTwoPoints = function(inPointOne, inPointTwo) {
		var distX = Math.abs(inPointOne.x - inPointTwo.x);
		var distY = Math.abs(inPointOne.y - inPointTwo.y);

		return Math.sqrt((distX * distX) + (distY * distY));
	};

	// Public scope
	var my = {
		/**
		  * This method adds the class 'hd' in order to hide the element
		  * Is necessary have defined the CSS class "hd" as a class with "display: none" style
		  *
		  */
		hide: function() {
			divElm.classList.add('hd');
		},

		/**
		  * This class resets the animation in order to display the original image, and removes
		  * the "hd" class if isset
		  *
		  */
		show: function() {
			setAnimationImage(inStartPosition);
			divElm.classList.remove('hd');
		},

		/**
		  * Returns the current position in pixels on the X axe, the point considereer is the
		  * top left point of the div
		  *
		  * @return <int>: The number of pixels from the origin os the X axe
		  *
		  */
		getX: function() {
			return curentX;
		},

		/**
		  * Returns the current position in pixels on the Y axe, the point considereer is the
		  * top left point of the div
		  *
		  * @return <int>: The number of pixels from the origin os the Y axe
		  *
		  */
		getY: function() {
			return curentY;
		},

		/**
		  * Returns the width in pixels of the element
		  *
		  * @return <int>: The width in pixels of the element
		  *
		  */
		getWidth: function() {
			return divElm.offsetWidth;
		},

		/**
		  * Returns the height in pixels of the element
		  *
		  * @return <int>: The height in pixels of the element
		  *
		  */
		getHeight: function() {
			return divElm.offsetHeight;
		},

		/**
		  * This method checks if another AnimatedImage_Tool object crash (the area of the other
		  * object is inside the area of this object) against this object.
		  * You can use this method to check square or circular elements.
		  *
		  * @param inElemToCheck <object>: The AnimatedImage_Tool instance to check
		  * @param inType optional <str>: If is defined could be "circle", and will be considered
		  *	both elemnts as circular elements, by default will be both square elements
		  *
		  * @return <bool>: True if isset a crash, false if not
		  *
		  */
		checkCollision: function(inElemToCheck, inType) {
			if ((inType !== undefined) && (inType == 'circle')) {
				// Isset a crash in case of the distance between the center of both
				// elements is less than the sum of the radious
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
				// Isset a crash if one of the corners of the element to check is inside the
				// area of the other element
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

		/**
		  * This method is used for debug propouses, and adds a
		  * text over the image
		  *
		  * @param inText <str>: The text to be added
		  *
		  */
		setText: function(inText) {
			divElm.innerHTML = inText;
		},

		/**
		  * Moves an element to a determinate position, the given point will be the top
		  * left corner of the element
		  *
		  * @param inX <int>: The position in pixels of the X axe from the origin
		  * @param inY <int>: The position in pixels of the Y axe from the origin
		  *
		  */
		setPos: function(inX, inY) {
			curentX = inX;
			curentY = inY;
			divElm.style.setProperty('top', inY + 'px', '!important');
			divElm.style.setProperty('left', inX + 'px', '!important');
		},

		/**
		  * This method adds a CSS class to the div element
		  *
		  * @param inNewClass <str>: The name of the CSS class to add
		  *
		  */
		setClass: function(inNewClass) {
			divElm.classList.add(inNewClass);
		},

		/**
		  * This method creates an animation using a sequence of images of
		  * the spreadsheet
		  *
		  * @param inParams <object>: An object with the animation parameters,
		  *	the object can contain the next keys:
		  *		- type <str>: The type of the animation, can be loop (after
		  *			the end of the sequence change the way of the play
		  * 			sequence) or circle (after the end of the sequence
		  *			rewind to the first image), is is not specify play the
		  *			sequence once
		  *		- from <int>: The position into the spreadsheet to be played
		  *			as the first image of the sequence if is not specify
		  *			takes 1 as value
		  *		- to <int>: The position into the spreadsheet to be played
		  *			as the last image of the sequence if is not specify
		  *			takes the last image as value
		  *		- callback <function>: Function to call after the sequence
		  *			ends if type is nos specify
		  *		- localTimeInterval <int>: The time in miliseconds to leave
		  *			between the images are showed to the user
		  *
		  */
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

			// Launch the internal method who creates the animation
			animateFrame();
		},

		/**
		  * This method rotates the image the given number of degrees from the origin
		  * using the CSS -webkit-transform style
		  *
		  * @param inDeg <int>: The number of degrees to rotate the element
		  *
		  */
		rotate: function(inDeg) {
			divElm.style.setProperty('-webkit-transform', 'rotate(' + inDeg + 'deg)', '!important');
		},

		/**
		  * This method stops all the animations if any animation is in course
		  * and leaves the element with the las image showed
		  *
		  */
		stop: function() {
			movingTo = false;
			clearTimeout(moveInfo.movingLoop);
		},

		/**
		  * This method moves to a determinate position the element in a straight movement
		  * doing an animation (slide).
		  * 
		  * @param inX <int>: The target position in pexels over the X axe from the origin
		  * @param inY <int>: The target position in pexels over the Y axe from the origin
		  * @param inLoopTime <int>: The time in miliseconds between steeps
		  * @param inCallBack <function>: The callback function to be called when the elemnt
		  *	are in the target position
		  * @param inSteepPx <int>: The number of pixels that the element will be moved each steep
		  * @param inSteepCheckFunc optional <function>: A function to be called after each steep
		  * @param inSteepCheckFuncObj optional <object>: A object to be passed as first parameter
		  *	to the inSteepCheckFunc function
		  *
		  */
		moveTo: function(inX, inY, inLoopTime, inCallBack, inSteepPx, inSteepCheckFunc, inSteepCheckFuncObj) {
			movingTo = true;
			if ((moveInfo !== null) && (moveInfo.movingLoop !== undefined)) {
				clearTimeout(moveInfo.movingLoop);
			}

			// Configure the internal method
			moveInfo = {
				origTan: getTangent(curentX, curentY, inX, inY),
				targetX: inX,
				targetY: inY,
				steep: inSteepPx,
				loopTime: inLoopTime,
				steepCheckFunc: inSteepCheckFunc,
				steepCheckFuncObj: inSteepCheckFuncObj,
				endMovCallback: inCallBack};

			// Call to the internal method who moves the element using a timeout loop
                        moveLoop();
		},

		/**
		  * Stop the current animation of the element, and set the main image as image to show
		  * after that.
		  * 
		  */
		stopAnimation: function() {
			if (animationLoop !== null) {
				currentPos = inStartPosition;
				setAnimationImage(inStartPosition);

				clearTimeout(animationLoop);

				animationLoop = null;
				endAnimationCallBack = null;
			}
		},

		/**
		  * Init method to be called after the element object is created, and all is ready to draw the element.
		  * creates the div element where the animation will be displayed, and adds the corresponding class.
		  * 
		  */
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
