/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This class is used to control all the bubble features,
  * the image, move it, check collisions, etc
  *
  * @see config.bubbles
  * @see AnimatedImage_Tool
  *
  * @param inX <int>: The pixels of the X axis where the bubble will be created
  * @param inY <int>: The pixels of the T axis where the bubble will be created
  * @param inType <int>: The type of the  bubble to create
  *
  */
var Bullble_Controller = (function(inX, inY, inType) {
	// Will contain the image, @see AnimatedImage_Tool
	var image = null;
	// The type as a integer of the bubble (the color)
	var type = inType;

	/**
	  * The next method returns the point where the bubble will bounce
	  * according to the given angle in degrees  and the laterals of
	  * the pitch
	  *
	  * @param inAngle <int>: The degrees that the bubble have taking the
	  *	Y axe as reference
	  *
	  * @return <object>: Return the cordinates of the point where the bounce
	  * 	will be produced in pixel in an object with the next strucutre:
	  *		{
	  *			x: <int>,
	  *			y: <int>}
	  *
	  */
	var calcBounce = function(inAngle) {
		var point = null;
		// Convert the angle to radians
		var angle = (90 - Math.abs(inAngle)) * Math.PI / 180;

		// Check if the bubble goes to the right in order to calculate the distance
		// of the X axis
		if (inAngle > 0) {
			var b = config.ballsField.topRight.x - image.getX() - config.bubbles.width;
			var a = b * Math.tan(angle);
			var y = image.getY() - a;

			point = {
				x: config.ballsField.topRight.x - config.bubbles.width,
				y: y};
		} else {
			var b = image.getX() - config.ballsField.topLeft.x;
			var a = b * Math.tan(angle);
			var y = image.getY() - a;

			point = {
				x: config.ballsField.topLeft.x,
				y: y};
		}

		return point;
	};

	// Public scope
	var my = {
		/**
		  * Destroy the bubble moving it first to a given coordinates, and later to
		  * the bottom of the window, after all the movements destroy the element
		  *
		  * @param inJumpX <int>: The number in pixels of the X axe to move the ball
		  * @param inJumpY <int>: The number in pixels of the Y axe to move the ball
		  *
		  */
		destroy: function(inJumpX, inJumpY) {
			// First jump
			my.moveTo(inJumpX, inJumpY, function() {
				// Move to bottom
				my.moveTo(inJumpX, config.windowConf.height, function() {
					// Destroy the bubble
					image.hide();
					image = null;
				});
			});
		},

		/**
		  * Launch a bubble from the shooter using a determinate angle
		  *
		  * @param inAngle <int>: The initial angle that the shooter have at the moment of the launch
		  * @param inAngle <object Compressor_Controller>: The object of the main compressor
		  *
		  */
		shoot: function(inAngle, inCompressor) {
			var targetPoint = calcBounce(inAngle);

			this.moveTo(targetPoint.x, targetPoint.y, function() {
				my.shoot(inAngle * -1, inCompressor);
			}, inCompressor.checkCollision);
		},

		/**
		  * Move the bubble to a determinate position, sliding the bubble till the objective
		  *
		  * @param inX <int>: The pixels of the X axe to move the bubble where
		  * @param inY <int>: The pixels of the Y axe to move the bubble where
		  * @param inCallBack <function>: The function to be called after the movement ends
		  * @param inCheckCollFunc <function>: The function to call each step the bubble
		  *	gives till the objective is reached
		  *
		  */
		moveTo: function(inX, inY, inCallBack, inCheckCollFunc) {
			image.moveTo(inX, inY, config.bubbles.loopTime, inCallBack, config.bubbles.steepPx, inCheckCollFunc, this);
		},

		/**
		  * Returns an integer as the type of the bubble
		  *
		  * @return <int>: The number assigned to this bubble
		  *
		  */
		getType: function() {
			return type;
		},

		/**
		  * Returns the object of the animated image the represents the bubble
		  *
		  * @see AnimatedImage_Tool
		  * @return <AnimatedImage_Tool>: The object to the bubble element
		  *
		  */
		getImage: function() {
			return image;
		},

		/**
		  * This method creates an image to add it as mask over the bubble image
		  * that creates the frozen ilusion
		  *
		  */
		froze: function() {
			var frozeImage = new AnimatedImage_Tool('bubble_frozzen');
			frozeImage.init();
			frozeImage.setPos(image.getX() - 1, image.getY() - 1);
			frozeImage.show();
		},

		/**
		  * Stops all the animations of the bubble
		  *
		  */
		stop: function() {
			image.stop();
		},

		/**
		  * Init the bubble, create the object of the bubble, and shows it into the
		  * position specified ad the constructor
		  *
		  */
		init: function() {
			if (type === undefined) {
				type = Math.floor(Math.random() * config.bubbles.totalTypes);
			}

			image = new AnimatedImage_Tool(
				'bubble',
				type,
				0,
				config.bubbles.totalTypes);

			image.init();
			image.setPos(inX, inY);
			image.show();
		}
	};

	return my;
});
