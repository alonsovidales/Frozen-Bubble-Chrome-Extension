var config = {
	windowConf: {
		width: 640,
		height: 480
	},

	gameCanvas: {
		id: 'main_canvas',
		width: 255,
		height: 375,
		top: 0,
		left: 190
	},

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

	shooter: {
		top: 364,
		left: 275,
		width: 100,
		height: 100
	},

	player: {
		constrols: {
			left: 1,
			right: 1,
			trigget: 1
		},
		imageAttr : {
			width: 80,
			height: 60,
			images: 70,
			loopTime: 10
		},
		top: 428,
		left: 412,
		winSnd: 'snd/win.ogg',
		gameOverSnd: 'snd/lose.ogg',
		shotSnd: 'snd/launch.ogg',
		rotationSpeedLoop: 10
	},

	bubbles: {
		totalTypes: 8,
		width: 32,
		height: 32,
		loopTime: 3,
		steepPx: 3
	},

	compressor: {
		x: 200,
		initY: -3,
		baseLoopTime: 30000,
		timeToDecreaseByLevel: 1500,
		width: 252,
		height: 51,
		newRootSnd: 'snd/new_root.ogg',
		extensor: {
			x: 233,
			width: 188,
			height: 28,
		}
	},

	bubblesGrid: {
		moveDestroyAnimation: 40,
		x: 198,
		heightCorrection: 4,
		minBubblesToBeConsideredAsGroup: 3,
		stickBubbleSnd: 'snd/stick.ogg',
		destroyGroupSnd: 'snd/destroy_group.ogg'
	},

	scoreBoard: {
		pointsByLevel: 100,
		pointsByBubble: 5
	}
};
