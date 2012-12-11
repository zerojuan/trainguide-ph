$(document).ready(function($) {
	var mapStyle = [
		{
			featureType:"road",
			elementType:"geometry",
			stylers:[{hue:"#8800ff"},{lightness:100}]
		},{
			featureType:"road",
			stylers:[{visibility:"on"},{hue:"#91ff00"},{saturation:-62},{gamma:1.98},{lightness:45}]
		},{
			featureType:"water",
			stylers:[{hue:"#005eff"},{gamma:.72},{lightness:42}]
		},{
			featureType:"transit.line",
			stylers:[{visibility:"off"}]
		},{
			featureType:"administrative.locality",
			stylers:[{visibility:"on"}]
		},{
			featureType:"administrative.neighborhood",
			elementType:"geometry",
			stylers:[{visibility:"simplified"}]
		},{
			featureType:"landscape",
			stylers:[{visibility:"on"},{gamma:.41},{lightness:46}]
		},{
			featureType:"administrative.neighborhood",
			elementType:"labels.text",
			stylers:[{visibility:"on"},{saturation:33},{lightness:20}]
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
