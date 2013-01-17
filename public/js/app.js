$(document).ready(function($) {
	var LRT1_COLOR = '#fdc33c';
	var LRT2_COLOR = '#ad86bc';
	var MRT_COLOR = '#5384c4';
	var PNR_COLOR = '#f28740';

	var mapStyle = [
		{
			featureType:"road",
			elementType:"geometry",
			stylers:[{hue:"#8800ff"},{lightness:100}]
		},{
		    featureType: "transit.station",
		    stylers: [
		      { visibility: "off" }
		    ]
		},{
		    featureType: "transit.station.rail",
		    stylers: [
		      { visibility: "on" }
		    ]
		},{
		    featureType: "transit.station",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
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
			stylers:[{visibility:"off"},{saturation:33},{lightness:20}]
		}];

	var mapOptions = {
        center: new google.maps.LatLng(14.5833, 121),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle,
        zoomControl : true,
        zoomControlOptions : {
        	style : google.maps.ZoomControlStyle.SMALL
        },
        disableDefaultUI : true
	};

	var directionsService = new google.maps.DirectionsService();

	var lrt1Display = new google.maps.Polyline({
		strokeColor : LRT1_COLOR,
		strokeOpacity : 0.9,
		strokeWeight : 6
	});
	var lrt2Display = new google.maps.Polyline({
		strokeColor : LRT2_COLOR,
		strokeOpacity : 0.9,
		strokeWeight : 6
	});
	var mrt3Display = new google.maps.Polyline({
		strokeColor : MRT_COLOR,
		strokeOpacity : 0.9,
		strokeWeight : 6
	});
	var pnrDisplay = new google.maps.Polyline({
		strokeColor : PNR_COLOR,
		strokeOpacity : 0.9,
		strokeWeight : 6
	});

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
		$.getJSON('./js/stops.data.json', function(json){
			console.log(json);
			for(var i in json){
				var line = json[i];
				makeStopMarkers(line);				
			}

			var circleDrawn = false;
			google.maps.event.addListenerOnce(map, 'idle', function() {				
				console.log('Loaded');
				if(!circleDrawn){
					drawCircles();
					circleDrawn = true;
				}		      		
			});
			google.maps.event.addListenerOnce(map, 'tilesloaded', function() {				
				console.log('TIles');
				if(!circleDrawn){
					drawCircles();
					circleDrawn = true;
				}		      		
			});
	}).error(function(err){console.log(err)});

	function drawCircles(){
		$('.LRT1-marker').svg({onLoad: function(svg){
		      	console.log('Drawing: .LRT1');
		    	drawCircle(svg, LRT1_COLOR);
			}
		});
		$('.LRT2-marker').svg({onLoad: function(svg){
				console.log('Drawing: .PNR');
		      	drawCircle(svg, LRT2_COLOR);
			}
		});
		$('.PNR-marker').svg({onLoad: function(svg){
				console.log('Drawing: .LRT2');
		      	drawCircle(svg, PNR_COLOR);
			}
		});
		$('.MRT-marker').svg({onLoad: function(svg){
				console.log('Drawing: .MRT');
		      	drawCircle(svg, MRT_COLOR);
			}
		});
	}

	function makeStopMarkers(line){
		for(var i in line.stops){
			var stop = line.stops[i];
			var marker = new RichMarker({
				map: map,
				position : new google.maps.LatLng(stop.position.lat, stop.position.long),
				anchor : RichMarkerPosition.MIDDLE,
				content : div(line.name),
				flat : true
			});			
			
			attachInfoWindow(marker, stop);
			
			
		}
	}

	var selectedWindow;
	var prevStop;
	var clickedMarker = false;
	var markerOpen = false;

	function attachInfoWindow(marker, stop){
		var infoWindow = createInfoWindow(stop.name);
		google.maps.event.addListener(marker, 'click', function(){
			infoWindow.open(map, marker);
			selectedWindow = infoWindow;
			clickedMarker = !clickedMarker;
			toggleSidebar(stop);

			//zoom into location
			map.panTo(new google.maps.LatLng(stop.position.lat, stop.position.long));
			map.setZoom(16);

		});
		google.maps.event.addListener(marker, 'mouseover', function(){
			if(selectedWindow){
				selectedWindow.close();
			}
			infoWindow.open(map, marker);
			selectedWindow = infoWindow;
		});
		google.maps.event.addListener(marker, 'mouseout', function(){
			if(clickedMarker) return;
			if(selectedWindow){
				selectedWindow.close();
			}			
		});
	}

	function toggleSidebar(stop){
		var stopContainer = $('#stop-details');
		
		if(markerOpen){
			if(prevStop && stop.name == prevStop.name){
				console.log('Selected stop is the same as before');
				hideSideBar(stopContainer, function(){markerOpen = false;});				 
				prevStop = stop;
			}else{
				hideSideBar(stopContainer, function(){
					showSideBar(stopContainer, stop, function(){
						markerOpen = true;
					});
				})
				prevStop = stop;	
			}
			
		}else{
			showSideBar(stopContainer, stop, function(){markerOpen = true;});
			prevStop = stop;
		}
	}

	function hideSideBar(stopContainer, onComplete){
		stopContainer.css('border-right' , "none");
		stopContainer.animate({"right": "0px"}, "fast", onComplete);	
	}

	function showSideBar(stopContainer, stop, onComplete){
		var width = stopContainer.width();
		var name = stop.name.split(' ');
		var line = name[0];
		name.splice(0, 1);
		name = name.join(' ');
		
		var color;

		switch(line){
			case 'LRT-1' : color = LRT1_COLOR;
							break;
			case 'LRT-2' : color = LRT2_COLOR;
							break;
			case 'MRT-3' : color = MRT_COLOR;
							break;
			case 'PNR' : color = PNR_COLOR;
							break;
		}
		stopContainer.find("#stop-name").html(line + ' ' + name);
		stopContainer.find("#description").html(stop.details.description)
		stopContainer.css('border-right' , "solid 6px " + color);
		stopContainer.animate({"right": "+="+(width-1)+"px"}, "slow", function(){markerOpen = true;});		
	}

	function drawCircle(svg, color){
		svg.circle(15, 15, 10, {fill: 'white', stroke: color, strokeWidth: 3});
	}

	function createInfoWindow(name){
		//console.log('Creating new info window: ' + name);
		return new InfoBox({
			content : '<div class="infobox">'+name+'</div>',
			boxStyle :{
				opacity : 0.75
			},
			closeBoxURL : "",
			maxWidth : 100,
			pixelOffset: new google.maps.Size(-50, -60),
			infoBoxClearance: new google.maps.Size(2,2)
		});
	}

	function div(name){
		var m = document.createElement('DIV');
        m.innerHTML = '<div class="stop-marker '+name+'-marker" style="width: 30px; height: 30px;"></div>';
        return m;
	}
	
	google.maps.event.addListener(map, 'click', function(event){
		console.log(event.latLng);
	});

	
   });
});
