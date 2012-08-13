var application_root = __dirname,
	express =  require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	config = require("./configurer");

var app = express();

//DATABASE

mongoose.connect(config.creds.mongoose_auth);

//CONFIG

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({dumpException : true, showStack : true}));
});

//SETUP API

app.get('/api/path', function(req, res){
	res.send('PATH MO INA MO');
});

app.listen(3000);
console.log('Listening to port 3000');
