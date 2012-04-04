var Player_Controller = (function(inCompressor) {
	var compressor = inCompressor;
	var penguin = null;
	var shooter = null;
	var currentStatus = null;
	var rotationLoop = null;
	var shooterRotatedDeg = 0;
	var chamberBubble = null;
	var shooterBall = null;
	var hurryTimeout = null;
	var alertTimeout = null;
	var stopped = false;

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
		SoundManager_Tool.play(config.player.shotSnd);

		chargeChamberBall();

		if (shooterBall !== null) {
			shooterBall.shoot(shooterRotatedDeg, compressor);
		}
		shooterBall = null;

		penguin.animate({
			from: 20,
			to: 49});

		currentStatus = null;

		resetHurry();
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

		chamberBubble.init();

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

	var resetHurry = function() {
		if (hurryTimeout !== null) {
			clearTimeout(hurryTimeout);
		}
		if (alertTimeout !== null) {
			clearTimeout(alertTimeout);
			UserAlerts_Tool.removeAlert();
			SoundManager_Tool.stop(config.player.hurrySnd);
		}
		hurryTimeout = setTimeout(function() {
			SoundManager_Tool.play(config.player.hurrySnd, true);

			UserAlerts_Tool.showAlert('hurry', true);
			alertTimeout = setTimeout(function() {
				SoundManager_Tool.stop(config.player.hurrySnd);
				shoot();
				UserAlerts_Tool.removeAlert();
			}, config.player.timeToShowHurry);
		}, config.player.timeToShoot);
	};

	return {
		win: function() {
			if (!stopped) {
				SoundManager_Tool.play(config.player.winSnd);

				stopped = true;
				clearTimeout(rotationLoop);
				clearTimeout(hurryTimeout);
				clearTimeout(alertTimeout);

				penguin.setClass('winner');
				penguin.animate({
					from: 1,
					to: 68,
					type: 'loop'
				});
			}
		},

		gameOver: function() {
			if (!stopped) {
				SoundManager_Tool.play(config.player.gameOverSnd);

				stopped = true;
				clearTimeout(rotationLoop);
				clearTimeout(hurryTimeout);
				clearTimeout(alertTimeout);

				penguin.setClass('looser');
				penguin.animate({
					from: 1,
					to: 157
				});
			}
		},

		init: function() {
			shooter = new AnimatedImage_Tool('shooter');
			shooter.init();
			shooter.setPos(config.shooter.left, config.shooter.top);
			shooter.show();

			penguin = new AnimatedImage_Tool(
				'penguin',
				19,
				config.player.imageAttr.loopTime,
				config.player.imageAttr.images);

			penguin.init();
			penguin.setPos(config.player.left, config.player.top);
			penguin.show();

			chargeChamberBall();
			rotateObserver();

			resetHurry();

			document.addEventListener('keydown', function(inEvent) {
				if (!stopped) {
					switch (inEvent.keyCode) {
						case config.player.constrols.trigger:
						case config.player.constrols.secondTrigger:
							shoot();
							break;
	
						case config.player.constrols.left:
							moveToLeft();
							break;
	
						case config.player.constrols.right:
							moveToRight();
							break;
					}
				}
			});

			document.addEventListener('keyup', function(inEvent) {
				moveToCenter();
			});
		}
	};
});
