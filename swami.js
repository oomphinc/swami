jQuery(function($) {

	var tracker = new tracking.ObjectTracker('face');
	tracker.setInitialScale(4);
	tracker.setStepSize(2);
	tracker.setEdgesDensity(0.1);

	tracking.track('#webcam', tracker, { camera: true });
	tracker.on('track', function(event) {
		console.log(event);
	});

});