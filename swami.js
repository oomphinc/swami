jQuery(function($) {

	// track what part of the process we're in
	var state = 'idle'
		, end = 0
		, $video = $('#swami_video')
		, $printer = $('#printer')
		, tracker = new tracking.ObjectTracker('face')
		, speech = new webkitSpeechRecognition()
		, teaseDelay = 500 //ms between teasers
		, faceThreshold = 1000 //sec max since last face was seen
		, lastFace // timestamp of last time a face was detected
		, faceTracks = []
		, facePercent = 0
		, numTracks = 20 //number of face track events to save to average whether a person is present
		, timeCodes = {
			'idle': [[0,34]],
			'teaser': [[35,42], [43,47], [48,53]],
			'intro': [[54,72]],
			'subintro': [[73,81], [82,91], [92,101]],
			'preface': [[102,114]],
			'question': [[114.5,121], [122,133], [134.5,141.5], [142,146], [147,153], [154,158], [159,167.5], [168,174], [175,180], [181,187]],
			'wait': [[188,194]],
			'abandon': [[195,202]],
		}
		, sequence = [ 'intro', 'subintro', 'preface', 'question', 'wait' ]
		, asked = [] // asked questions
		, toAsk = 3
		, answered = false //if the current asked question is answered
		, said //store transcript of speech result
		, listening //whether speech recognition has started
	;
	dog = speech;

	// set up tracker
	tracker.setInitialScale(4);
	tracker.setStepSize(2);
	tracker.setEdgesDensity(0.1);

	// init tracker
	tracking.track('#webcam', tracker, { camera: true });

	tracker.on('track', function(event) {
		var face = event.data.length>0;
		if (face) {
			lastFace = Date.now();
		}
		faceTracks.unshift(face);
		faceTracks = faceTracks.slice(0,numTracks);
		facePercent = faceTracks.reduce(function(a, b) { return a + b; }) / faceTracks.length;
		// at least one face?
		$('body').toggleClass('face', face);
	}); // */

	// this will be our 'tick'er
	$video.on('timeupdate', function(event) {
		// if the current clip has ended, switch to the next state
		if (event.target.currentTime>=end) {
			switch (state) {
				case 'intro':
					playClip(getRandom(timeCodes.subintro));
					state = 'subintro';
				break;

				case 'subintro':
					playClip(timeCodes.preface[0]);
					state = 'preface';
				break;

				case 'preface':
					var q = getRandom(timeCodes.question,asked);
					asked.push(timeCodes.question.indexOf(q));
					playClip(q);
					state = 'question';
				break;

				case 'question':
					if (answered) {
						// done with Q's, move on
						if (asked.length==toAsk) {
							asked.length = 0; //clear array
							state = 'idle';
							playClip(timeCodes.wait[0]);
							// PRINT HERE
							$printer[0].src = '//localhost/name/';
						} else {
							// play the next question
							var q = getRandom(timeCodes.question,asked);
							asked.push(timeCodes.question.indexOf(q));
							playClip(q);
						}
						answered = false;
					} else {
						// show idle while waiting for answer
						playClip(getRandom(timeCodes.idle));
						if (!listening) {
							speech.start();
						}
					}
				break;

				default:
					playClip(getRandom(timeCodes.idle));
					state = 'idle';
			}
			console.log(state);
		}
		// if in idle, check for a face to trigger
		if (state==='idle') {
			if (Date.now() - lastFace < faceThreshold && facePercent >= 0.5) {
				console.log('triggered');
				state = 'intro';
				playClip(timeCodes.intro[0]);
			}
		}
	});

	// set up speech recognition
	//speech.continuous = true;
	//speech.start();

	speech.onresult = function(event) {
		// do we have a result?
		if (event.results && event.results.length && event.results[0] && event.results[0][0] && (said = event.results[0][0].transcript)) {
			console.log(said);
			if (/\b(?:yes|yeah|ya|now|no|nope)\b/i.test(said)) {
				answered = true;
				$video[0].currentTime = end;
			}
		}
	}

	speech.onstart = function() {
		listening = true;
	}

	speech.onend = function() {
		if (state==='question' && !answered) {
			speech.start();
		} else {
			listening = false;
		}
	}

	/**
	 * Get a random array element
	 * @param  {array} arr    [description]
	 * @param  {array} notArr indexes to not choose
	 * @return {mixed}        element
	 */
	function getRandom(arr,notArr) {
		var index = ~~(Math.random()*arr.length);
		if (notArr && notArr.indexOf(index)>=0) {
			return getRandom(arr,notArr);
		}
		return arr[index];
	}

	function playClip(time) {
		$video[0].currentTime = time[0];
		end = time[1];
	}

	function goIdle() {

	}

});