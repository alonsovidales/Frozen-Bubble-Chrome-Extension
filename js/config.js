/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-29
  *
  * Global config object
  */
var config = {
	// Debug var, set false for a production env
	debug: false,

	// Lik to the author CV
	cvLink: 'http://es.linkedin.com/pub/alonso-vidales/6/a9b/225',

	// Main window configuration
	windowConf: {
		width: 640,
		height: 480
	},

	// Game_Controller configuration
	game: {
		totalLevels: 7
	},

	// Main div element configuration
	gameCanvas: {
		// The id of the div where the game will be rendered
		id: 'main_canvas'
	},

	// The corners coordinates game pitch
	ballsField: {
		topLeft: {
			x: 197,
			y: 12
		},
		topRight: {
			x: 455,
			y: 10
		},
		bottLeft: {
			x: 197,
			y: 390
		},
		bottRight: {
			x: 455,
			y: 390
		}
	},

	// The size and coordinates of the shooter
	shooter: {
		top: 364,
		left: 275,
		width: 100,
		height: 100,
		maxRotationDegLeft: -70,
		maxRotationDegRight: 70
	},

	// The configuration for Player_Controller
	player: {
		// The code of the keys to control the player
		constrols: {
			left: 37,
			right: 39,
			trigger: 38,
			secondTrigger: 32
		},
		// The configuration parameters for the penguin image
		// @see img/penguins/shooters.png
		imageAttr : {
			width: 80,
			height: 60,
			images: 70,
			// The position of the image where starts the shoot animation
			shootAnimationFrom: 20,
			// The position of the image where ends the shoot animation
			shootAnimationTo: 49,
			// The position of the image where starts the animation to move to the right the shooter,
			rightAnimationFrom: 50,
			// The position of the image where starts the animation to move to the right the shooter,
			rightAnimationTo: 71,
			// The position of the image where starts the animation to move to the left the shooter
			leftAnimationFrom: 19,
			// The position of the image where ends the animation to move to the left the shooter
			leftAnimationTo: 0,
			// The time between frames in miliseconds
			loopTime: 10
		},
		// Winner image animation attributes
		// @see img/penguins/win.png
		winnerImageAttr : {
			animationFrom: 1,
			animationTo: 68
		},
		// Lost image animation attributes
		// @see img/penguins/looser.png
		loserImageAttr : {
			animationFrom: 1,
			animationTo: 157
		},

		// The position of the player
		top: 428,
		left: 412,

		// The max time between shoots
		timeToShoot: 5000,
		// The time to wait after a shoot to show the "hurry" alert
		timeToShowHurry: 2000,
		// Sound file for the hurry alert
		hurrySnd: 'snd/hurry.ogg',
		// Sound to be played when the user win the game
		winSnd: 'snd/win.ogg',
		// Sound to be played when the user lost the game
		gameOverSnd: 'snd/lose.ogg',
		// Sound to be played when on each shoot
		shotSnd: 'snd/launch.ogg',
		// The time in miliseconds for rotate a degree the shooter, determinates the angular speed
		rotationSpeedLoop: 8
	},

	// Configuration parameters for Bullble_Controller
	// @see img/bubbles/bubbles.gif
	bubbles: {
		// The total number of different bubbles color
		totalTypes: 8,
		width: 32,
		height: 32,
		loopTime: 3,
		steepPx: 3
	},

	// Configuration params for Compressor_Controller
	compressor: {
		// x axe position
		x: 200,
		// Initial position on the Y axe
		initY: -3,
		// Time in ms between compresor movements
		baseLoopTime: 30000,
		// Time in ms to decrease the baseLoopTime each level: baseLoopTime = timeToDecreaseByLevel * level
		timeToDecreaseByLevel: 1500,
		width: 252,
		height: 51,
		// Sound to be played each movement
		newRootSnd: 'snd/new_root.ogg',
		// Extensor iamge configuration parameters
		extensor: {
			x: 233,
			width: 188,
			height: 28
		}
	},

	// Configuration parameters for BubblesGrid_Controller
	bubblesGrid: {
		// The number os pixels to move the bubbles when a group is destroyed to create the crash animation
		moveDestroyAnimation: 40,
		// Initial X axis in px
		x: 198,
		// The number of pixels that the bubbles are overlapping
		heightCorrection: 4,
		// The number of bubbles that determine a group
		minBubblesToBeConsideredAsGroup: 3,
		// The sound file to be played when the bubbles are sticked
		stickBubbleSnd: 'snd/stick.ogg',
		// The sound file to be played when a group is destroyed
		destroyGroupSnd: 'snd/destroy_group.ogg'
	},

	// The score configuration
	scoreBoard: {
		// The number of points to increase the player score for each level
		pointsByLevel: 100,
		// The number of points to increase the player score for each bubble
		pointsByBubble: 5,
		// The X axis in px position of the score text
		x: 15,
		// The Y axis in px position of the score text
		y: 100
	}
};
