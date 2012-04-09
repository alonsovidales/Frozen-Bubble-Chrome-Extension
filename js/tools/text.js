/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This class is used to create funny texts using the special font of the game
  * the font is taked from the corresponding spreadsheet
  *
  * @see css/styles.css classes:
  *	font
  *	font.hi
  *	font.char
  *
  * @param inText <str>: The text to create in lower case
  * @param inFontType optional <str>: The type of font to use (subclass in css), by
  *	default is char
  *
  */
var Text_Tool = (function (inText, inFontType){
	/**
	  * This object containt the width and forsition of each letter into the
	  * spreadsheet image specified in pixels
	  *
	  */
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

	// Will continat the main div of the text created in order to move, remove, etc all
	// the sub-divs that represents the letters
	var containerDiv = null;
	// The current position on the X axe to draw the next character
	var leftPadPx = 0;

	/**
	  * This method adds a leter to the main div that contents all the letters
	  * The character shouldbe a key of the letters object
	  *
	  * @param inChar <char>: The character to add
	  *
	  */
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

	// Public scope
	return {
		/**
		  * This method adds the click event to the main div that calls to the
		  * give function.
		  * Adds too the class "text_link" to the div that should contain the
		  * cursor: pointer; style
		  *
		  * @see css/styles.css file: text_link class
		  * @param inFunction <function>: The function to be called when the
		  *	user do click over the main div element
		  *
		  */
		addLink: function(inFunction) {
			containerDiv.classList.add('text_link');
			containerDiv.addEventListener('click', inFunction);
		},

		/**
		  * This method creates letter by letter the text to show
		  * If a previous text is set, remove the text before create the new one
		  *
		  * @param inText <str>: The text to draw in lower case
		  *
		  */
		setText: function(inText) {
			containerDiv.innerHTML = '';
			leftPadPx = 0;

			for (var count = 0; count < inText.length; count++) {
				addLetter(inText[count]);
			}
		},

		/**
		  * The method initialize all the elements to represent the text, and create the
		  * main container div into the given position
		  * If a text was specify as a paremeter of the constructor, add the text after create the div
		  *
		  * @param inX <int>: The position in pixel of the X axe where the main div will be created
		  * @param inY <int>: The position in pixel of the Y axe where the main div will be created
		  *
		  */
		init: function(inX, inY) {
			var mainCanvas = document.getElementById(config.gameCanvas.id);
			containerDiv = document.createElement("div");

			containerDiv.style.setProperty('position', 'absolute');
			containerDiv.style.setProperty('left', inX + 'px', '!important');
			containerDiv.style.setProperty('top', inY + 'px', '!important');

			mainCanvas.appendChild(containerDiv);

			// Add the text specify on the constructor
			if (inText !== undefined) {
				this.setText(inText);
			}
		}
	};
});
