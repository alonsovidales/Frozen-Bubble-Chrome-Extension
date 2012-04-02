var UserAlerts_Tool = (function() {
	var divElm = null;
	var imageShowed = true;
	var flashLoop = null;

	var flashImage = function() {
		if (imageShowed) {
			divElm.classList.add('hd');
		} else {
			divElm.classList.remove('hd');
		}

		imageShowed = !imageShowed;

		flashLoop = setTimeout(flashImage, 300);
	};

	return {
		removeAlert: function() {
			if (flashLoop !== null) {
				clearTimeout(flashLoop);
			}
			divElm.classList.add('hd');
		},

		showAlert: function(inClass, inFlash, inButtonText, inButtonFunc) {
			var mainCanvas = document.getElementById(config.gameCanvas.id);

			divElm = document.createElement("div");
			divElm.classList.add('alert');
			divElm.classList.add(inClass);

			mainCanvas.appendChild(divElm);

			var xPos = (window.innerWidth / 2) - (divElm.offsetWidth / 2);
			divElm.style.setProperty('left', xPos + 'px', '!important');

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
