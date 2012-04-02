var Text_Tool = (function (inText, inFontType){
	var letters = {
		a: {
			x: 526,
			width: 15},
		b: {
			x: 541,
			width: 16},
		c: {
			x: 556,
			width: 15},
		d: {
			x: 571,
			width: 15},
		e: {
			x: 586,
			width: 15},
		f: {
			x: 601,
			width: 16},
		g: {
			x: 617,
			width: 16},
		h: {
			x: 634,
			width: 17},
		i: {
			x: 650,
			width: 15},
		j: {
			x: 667,
			width: 15},
		k: {
			x: 683,
			width: 15},
		l: {
			x: 700,
			width: 15},
		m: {
			x: 716,
			width: 15},
		n: {
			x: 733,
			width: 16},
		o: {
			x: 752,
			width: 12},
		p: {
			x: 766,
			width: 13},
		q: {
			x: 780,
			width: 14},
		r: {
			x: 796,
			width: 16},
		s: {
			x: 815,
			width: 16},
		t: {
			x: 833,
			width: 16},
		u: {
			x: 852,
			width: 14},
		v: {
			x: 869,
			width: 14},
		w: {
			x: 886,
			width: 15},
		x: {
			x: 905,
			width: 16},
		y: {
			x: 925,
			width: 17},
		z: {
			x: 945,
			width: 20},
		0: {
			x: 240,
			width: 15},
		1: {
			x: 257,
			width: 14},
		2: {
			x: 274,
			width: 14},
		3: {
			x: 291,
			width: 13},
		4: {
			x: 307,
			width: 14},
		5: {
			x: 324,
			width: 16},
		6: {
			x: 342,
			width: 14},
		7: {
			x: 359,
			width: 15},
		8: {
			x: 378,
			width: 14},
		9: {
			x: 395,
			width: 15},
		':': {
			x: 423,
			width: 8},
		' ': {
			width: 5}};

	var containerDiv = null;
	var textLetters = [];
	var leftPadPx = 0;

	var addLetter = function(inChar) {
		var divElm = document.createElement("div");
		divElm.classList.add('font');

		if (inChar != ' ') {
			if (inFontType == 'hi') {
				divElm.classList.add('hi');
			} else {
				divElm.classList.add('char');
			}
			divElm.style.setProperty('background-position', '-' + letters[inChar].x + 'px -1px', '!important');
		}

		divElm.style.setProperty('left', leftPadPx + 'px', '!important');
		divElm.style.setProperty('width', letters[inChar].width + 'px');
		divElm.style.setProperty('height', '27px');
		leftPadPx += letters[inChar].width;

		containerDiv.appendChild(divElm);
	};

	return {
		addLink: function(inFunction) {
			containerDiv.classList.add('text_link');

			containerDiv.addEventListener('click', inFunction);
		},

		setText: function(inText) {
			containerDiv.innerHTML = '';
			leftPadPx = 0;

			for (var count = 0; count < inText.length; count++) {
				addLetter(inText[count]);
			}
		},

		init: function(inX, inY) {
			var mainCanvas = document.getElementById(config.gameCanvas.id);
			containerDiv = document.createElement("div");

			containerDiv.style.setProperty('position', 'absolute');
			containerDiv.style.setProperty('left', inX + 'px', '!important');
			containerDiv.style.setProperty('top', inY + 'px', '!important');

			mainCanvas.appendChild(containerDiv);

			if (inText !== undefined) {
				this.setText(inText);
			}
		}
	};
});
