var Player_Controller = (function() {
	var penguin = null;
	var shooter = null;
	var currentStatus = null;
	var rotationLoop = null;
	var shooterRotatedDeg = 0;
	var chamberBubble = null;

	var move_left = function() {
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
		penguin.animate({
			from: 20,
			to: 49});

		currentStatus = null;
	};

	var move_right = function() {
		if (currentStatus !== 'right') {
			currentStatus = 'right';

			penguin.animate({
				from: 50});
		}
	};

	var move_center = function() {
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
		chamberBubble = new Bullble_Controller(
			config.shooter.left + (config.shooter.width / 2) - (config.bubbles.width / 2),
			config.shooter.top + config.shooter.height - 10);
		chamberBubble.bootstrap();
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
				console.log(inEvent.keyCode);
				switch (inEvent.keyCode) {
					case 38:
					case 32:
						shoot();
						break;

					case 37:
						move_left();
						break;

					case 39:
						move_right();
						break;
				}
			});

			document.addEventListener('keyup', function(inEvent) {
				move_center();
			});
		}
	};
});
