$(document).ready(function($) {
	var mapStyle = [
		  {
		    featureType: "administrative",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		    featureType: "landscape",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		  	featureType: "water",
		    stylers: [
		      { saturation: -99 },
		      { lightness: -29 }
		    ]
		  },{
		    featureType: "water",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
  		  },{
		    featureType: "poi",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		    featureType: "road",
		    elementType: "geometry",
		    stylers: [
		      { visibility: "simplified" },
		      { saturation: -38 },
		      { lightness: 35 },
		      { hue: "#00eeff" }
		    ]
		  },{
		    featureType: "road",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		    featureType: "road",
		    elementType: "geometry",
		    stylers: [
		      { visibility: "off" }
		    ]
		  },{
		    "featureType": "transit.station.rail",
		    "stylers": [
		      { "visibility": "on" }
		    ]
		  }];

	var mapOptions = {
        center: new google.maps.LatLng(14.5833, 121),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);	

	var transitLayer = new google.maps.TransitLayer();
	transitLayer.setMap(map);
});
