var fs = require( 'fs' );
var mkdirp = require('mkdirp');
var express = require( 'express' );
var util = require('util');
var app = express();

app.use(express.bodyParser());
app.use(express.static( __dirname + "/public" ));

app.get('/', function(req,res) {
    util.log("GET received at /");
    res.send("Response!");
});

app.post('/log/:user', function(req, res) {
    console.log("POST at logging " + req.params.user);
    util.log("POST received at /log/" + req.params.user);
    //res.send(500, "Shit");
    
    var dirpath = __dirname + "/logs/" + req.params.user;
    mkdirp(dirpath, 0755, function(err) {
    	if (err) {
    		util.log(err);
    		res.send(500, "Could not save file");
    	}
    	else {
    		fs.rename(req.files.logfile.path, dirpath + "/" + req.files.logfile.name);
    		util.log("Received " + req.files.logfile.name);
		    res.send(200, "Server successfully received file " + req.files.logfile.name);
		}
    });
	
});

console.log(app.routes);

app.listen(process.env.PORT || 8080, function() {
    console.log("Running on port %d", process.env.PORT || 8080);
});	
