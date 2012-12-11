var application_root = __dirname,
	qs = require('querystring'),
	express =  require("express"),
	request = require("request"),	
	fs = require("fs");

var app = express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname+"/public"));
	app.use(express.errorHandler({dumpException : true, showStack : true}));
});

//SETUP API

app.get('/setup', function(req, res){
	//do some http-requests to fill data for our the main routes
	var mrtTaft = {
		lat : 14.537622765362455,
		lng : 121.00172281265259 
	};
	var mrtNorth = {
		lat : 14.652101682862511,
		lng : 121.03229999542236
	};
	var lrt1North = {
		lat : 14.657540698418241,
		lng : 121.02114200592041
	};
	var lrt1Baclaran = {
		lat : 14.534340976348494,
		lng : 120.99831104278564
	};
	var lrt2Recto = {
		lat : 14.603684349587176,
		lng : 120.98337650299072
	};
	var lrt2Santolan = {
		lat : 14.622163922789058,
		lng : 121.08590126037598
	};
	var pnrAlabang = {
		lat : 14.417140946249745,
		lng : 121.04753494262695
	};
	var pnrTutuban = {
		lat : 14.611408584925165,
		lng : 120.97299098968506
	};

	var lines = [];

	getDirections(mrtTaft, mrtNorth, lines, 'MRT',
		function(){
			getDirections(lrt2Recto, lrt2Santolan, lines, 'LRT2',
				function(){
					getDirections(lrt1North, lrt1Baclaran, lines, 'LRT1',
						function(){
							getDirections(pnrAlabang, pnrTutuban, lines, 'PNR');						
						});					
				});
	});
	

	

});

var buildPath = function(origin, dest, departureTime){
	var args = {
		origin : origin,
		destination : dest,
		mode : 'transit',
		sensor : true,
		departure_time : departureTime
	};
	return qs.stringify(args);
}

var getDirections = function(origin, dest, lines, name, callback){
	var origin = origin.lat+','+origin.lng
	var destination =dest.lat+','+dest.lng;
	var date = new Date();
	var path = buildPath(origin, destination, Math.round(date.getTime()/1000));

	var options = {
	    uri: 'https://maps.googleapis.com/maps/api/directions/json?' + path
	 };

	console.log('Line: ' + name)
	console.log(options.uri);

	request(options, function (error, res, data) {
      if (error) {
        console.log(error)
      }
      data = JSON.parse(data);
      if(data.status != 'OK'){
      	console.log(name);
      	console.log(data.status);
	  }else{
		console.log("REQUEST VALID:");
			var line = {
				name : name,
				points : data.routes[0].overview_polyline.points 
			};

			lines.push(line)
			if(lines.length == 4){
				console.log('Loaded all lines');
				saveLines(lines);
			}else{
				callback();
			}	
	  }
    });

};

var saveLines = function(lines){
	var outputFilename = './public/js/lines.data.json';

	fs.writeFile(outputFilename, JSON.stringify(lines, null, 4), function(err){
		if(err){
			console.log(err);
		}else{
			console.log("JSON Saved to " + outputFilename);
		}
	});
}
app.listen(process.env.PORT || 3000);
console.log('Listening to port 3000');