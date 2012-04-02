var Bullble_Controller = (function(inX, inY, inType) {
	var image = null;
	var type = inType;

	var calcBounce = function(inAngle) {
		var point = null;
		var angle = (90 - Math.abs(inAngle)) * Math.PI / 180;

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

	var my = {
		destroy: function(inJumpX, inJumpY) {
			my.moveTo(inJumpX, inJumpY, function() {
				my.moveTo(inJumpX, config.windowConf.height, function() {
					image.hide();
					image = null;
				});
			});
		},

		shoot: function(inAngle, inCompressor) {
			var targetPoint = calcBounce(inAngle);

			this.moveTo(targetPoint.x, targetPoint.y, function() {
				my.shoot(inAngle * -1, inCompressor);
			}, inCompressor.checkCollision);
		},

		moveTo: function(inX, inY, inCallBack, inCheckCollFunc) {
			image.moveTo(inX, inY, config.bubbles.loopTime, inCallBack, config.bubbles.steepPx, inCheckCollFunc, this);
		},

		getType: function() {
			return type;
		},

		getImage: function() {
			return image;
		},

		froze: function() {
			var frozeImage = new AnimatedImage_Tool('bubble_frozzen');
			frozeImage.init();
			frozeImage.setPos(image.getX() - 1, image.getY() - 1);
			frozeImage.show();
		},

		stop: function() {
			image.stop();
		},

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
