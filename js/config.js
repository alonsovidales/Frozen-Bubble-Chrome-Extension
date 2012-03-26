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
		rotationSpeedLoop: 10
	},

	bubbles: {
		totalTypes: 8,
		width: 32,
		height: 32,
		loopTime: 5,
		steepPx: 6 
	}
};
