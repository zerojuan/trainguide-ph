$(document).ready(function($) {
	var mapOptions = {
        center: new google.maps.LatLng(14.5833, 121),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);	

	var transitLayer = new google.maps.TransitLayer();
	transitLayer.setMap(map);
});
