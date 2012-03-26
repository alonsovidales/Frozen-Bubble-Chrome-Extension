var Player_Controller = (function() {
	var penguin = null;
	var shooter = null;
	var currentStatus = null;
	var rotationLoop = null;
	var shooterRotatedDeg = 0;
	var chamberBubble = null;
	var shooterBall = null;

	var moveToLeft = function() {
		if (currentStatus !== 'left') {
			currentStatus = 'left';

			penguin.animate({
				from: 19,
				to: 0});
		}
	};

	var rotateObserver = function() {
		if (currentStatus !== null) {
			if (currentStatus == 'left') {
				if (shooterRotatedDeg != -70) {
					shooter.rotate(--shooterRotatedDeg);
				}
			}
	
			if (currentStatus == 'right') {
				if (shooterRotatedDeg != 70) {
					shooter.rotate(++shooterRotatedDeg);
				}
			}
		}

		rotationLoop = setTimeout(rotateObserver, config.player.rotationSpeedLoop);
	};

	var shoot = function() {
		chargeChamberBall();

		targetPoint = shooterBall.calcBounce(shooterRotatedDeg);
		shooterBall.moveTo(targetPoint.x, targetPoint.y);

		penguin.animate({
			from: 20,
			to: 49});

		currentStatus = null;
	};

	var moveToRight = function() {
		if (currentStatus !== 'right') {
			currentStatus = 'right';

			penguin.animate({
				from: 50});
		}
	};

	var moveToCenter = function() {
		if (currentStatus == 'right') {
			penguin.animate({
				from: 71,
				to: 49});
		}

		if (currentStatus == 'left') {
			penguin.animate({
				from: 0,
				to: 19});
		}

		currentStatus = null;
	};

	var addNewBubbleToChamber = function() {
		shooterBall = chamberBubble;

		chamberBubble = new Bullble_Controller(
			0,
			config.shooter.top + config.shooter.height - 10);

		chamberBubble.bootstrap();

		chamberBubble.moveTo(
			config.shooter.left + (config.shooter.width / 2) - (config.bubbles.width / 2),
			config.shooter.top + config.shooter.height - 10);
	};

	var chargeChamberBall = function() {
		if (chamberBubble === null) {
			addNewBubbleToChamber();
		}

		chamberBubble.moveTo(
			config.shooter.left + (config.shooter.width / 2) - (config.bubbles.width / 2),
			config.shooter.top + (config.shooter.height / 2) - 16,
			function() {
				addNewBubbleToChamber();
			});
	};

	return {
		bootstrap: function() {
			shooter = new AnimatedImage_Tool('shooter');
			shooter.bootstrap();
			shooter.setPos(config.shooter.left, config.shooter.top);
			shooter.show();

			penguin = new AnimatedImage_Tool(
				'penguin',
				19,
				config.player.imageAttr.loopTime,
				config.player.imageAttr.images,
				config.player.imageAttr.width);

			penguin.bootstrap();
			penguin.setPos(config.player.left, config.player.top);
			penguin.show();

			chargeChamberBall();
			rotateObserver();

			document.addEventListener('keydown', function(inEvent) {
				switch (inEvent.keyCode) {
					case 38:
					case 32:
						shoot();
						break;

					case 37:
						moveToLeft();
						break;

					case 39:
						moveToRight();
						break;
				}
			});

			document.addEventListener('keyup', function(inEvent) {
				moveToCenter();
			});
		}
	};
});
