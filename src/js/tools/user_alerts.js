/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-26
  *
  * This class is used to to show alerts to the user in the middle of the pitch
  * The alerts should be defined in the CSS file inhereting from alert class
  * This is a singleton class that can be called as a global object
  *
  * @see css/styles.css classes:
  *	alert.loser
  *	alert.winner
  *	alert.winner_last_level
  *	alert.hurry
  *
  */
var UserAlerts_Tool = (function() {
	// The div element that will contain the alert
	var divElm = null;
	// True if the image is shown, false if is hidden
	var imageShowed = true;
	// The timeout that will control the flashing
	var flashLoop = null;

	/**
	  * This method is called in a loop in order to create a flash
	  * of the element experience, is called using the flashLoop timeout
	  * each 3 seconds
	  * 
	  * @see css/styles.css file: class hd
	  * 
	  */
	var flashImage = function() {
		if (imageShowed) {
			divElm.classList.add('hd');
		} else {
			divElm.classList.remove('hd');
		}

		imageShowed = !imageShowed;

		// Call itself in order to create a loop
		flashLoop = setTimeout(flashImage, 300);
	};

	// Public scope
	return {
		/**
		  * This method removes the alert message hidding the element
		  *
		  */
		removeAlert: function() {
			if (flashLoop !== null) {
				clearTimeout(flashLoop);
			}
			divElm.classList.add('hd');
		},

		/**
		  * This method shows the corresponding alert to the user
		  * In order to add a link at the botton right of the image, the background image should be designed
		  * for this propouse. The button will be added at the 125, 240 px position
		  *
		  * @see css/styles.css file, "alert" classes
		  *
		  * @param inClass <str>: The CSS class that inherate from the alert class and shows the corresponding image
		  * @param inFlash optional <bool>: If true the image flashes each 3 seconds, @see flashImage method
		  * @param inButtonText optional <str>: The text to display at the bottom right of the alert that will be showed as a link
		  * @param inButtonFunc optional <function>: The function to call when the user do click over the text link
		  *
		  */
		showAlert: function(inClass, inFlash, inButtonText, inButtonFunc) {
			var mainCanvas = document.getElementById(config.gameCanvas.id);

			divElm = document.createElement("div");
			divElm.classList.add('alert');
			divElm.classList.add(inClass);

			mainCanvas.appendChild(divElm);

			var xPos = (window.innerWidth / 2) - (divElm.offsetWidth / 2);
			divElm.style.setProperty('left', xPos + 'px');

			if (inFlash) {
				imageShowed = true;

				flashLoop = setTimeout(flashImage, 300);
			}

			if ((inButtonText !== undefined) && (inButtonText !== '')) {
				var levelText = new Text_Tool(inButtonText);
				levelText.init(xPos + 125, 240);
				levelText.addLink(inButtonFunc);
			}
		}
	};
})();
