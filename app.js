var application_root = __dirname,
	express =  require("express");

var app = express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname+"/public"));
	app.use(express.errorHandler({dumpException : true, showStack : true}));
});

//SETUP API

app.get('/api/path', function(req, res){
	res.send('PATH MO INA MO, I MADE SOME CHANGES');
});

app.listen(3000);
console.log('Listening to port 3000');
