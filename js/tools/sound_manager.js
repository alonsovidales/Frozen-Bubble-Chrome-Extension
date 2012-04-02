/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-14
  *
  * Global sound object used to handle the sound effects
  *
  */
var SoundManager_Tool = (function() {
	// Will be used as cache for load the music only one time
	var sounds = {};

	return {
		/**
		  * Plays a wav file
		  *
		  * @param inOggFile <string> : Path to wav file
		  * @param inCallback <funciton> : A function to be called after the game ends
		  */
		play: function (inOggFile, inCallback) {
			if (sounds[inOggFile] === undefined) {
				sounds[inOggFile] = new Audio(inOggFile);
			}
			sounds[inOggFile].play();

			// If is defined any call back function, call it after the sound ends
			if (inCallback !== undefined) {
				// Remove the previous events to avoid problems
				$(sounds[inOggFile]).unbind();
				$(sounds[inOggFile]).bind('ended', inCallback);
			}
		},

		/**
		  * The next method stop only a sound
		  *
		  * @param inOggFile <string> : Path to wav file
		  */
		stop: function(inOggFile) {
			if (sounds[inOggFile] !== undefined) {
				sounds[inOggFile].pause();
			}
		},

		/**
		  * The next method stops all the game sounds
		  */
		stopNoise: function () {
			$.each(sounds, function(inKey, inValue) {
				inValue.pause();
			});
		}
	};
}());
