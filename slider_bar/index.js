$("#range-slider").noUiSlider({
	start: 1000,
	range: {
		'min': 10,
		'max': 2000
	}
});

$("#range-slider").change(function(){
	
	var aiTime = $("#range-slider").val();
	ai.waitTime = aiTime;
});