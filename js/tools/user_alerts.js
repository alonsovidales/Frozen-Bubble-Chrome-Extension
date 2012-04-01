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
		showAlert: function(inClass, inFlash) {
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
		}
	};
})();
