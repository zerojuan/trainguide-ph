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
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle
	};

	var directionsService = new google.maps.DirectionsService();

	var lrt1Display = new google.maps.Polyline();
	var lrt2Display = new google.maps.Polyline();
	var mrt3Display = new google.maps.Polyline();
	var pnrDisplay = new google.maps.Polyline();

	var map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);	

	var rendererOptions ={
		hideRouteList : true,
		markerOptions : {
			visible : false
		},
		suppressMarkers : true,
		suppressInfoWindows : true,
		preserveViewPort : true
	};

	lrt1Display.setMap(map);
	lrt2Display.setMap(map);
	mrt3Display.setMap(map);
	pnrDisplay.setMap(map);

	console.log(google.maps.TravelMode.TRANSIT);

	$.getJSON('./js/lines.data.json', function(json){
		console.log(json);
		for(var i in json){
			var line = json[i];
			var decodedPath = google.maps.geometry.encoding.decodePath(line.points);
			switch(line.name){
				case 'LRT1' :
					lrt1Display.setPath(decodedPath);
					break;
				case 'LRT2' :
					lrt2Display.setPath(decodedPath);
					break;
				case 'MRT' :
					mrt3Display.setPath(decodedPath);
					break;
				case 'PNR' :
					pnrDisplay.setPath(decodedPath);
					break;
			}
		}
	});
});
