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

app.get('/listlogs/:user', function(req, res) {
    util.log("GET received at /listlogs/" + req.params.user);

    //Get all FILES in users log directory
    var files = [];
    var dirpath = __dirname + "/logs/" + req.params.user;
    fs.readdir(dirpath, function(err, candidates) {
        if (err) {
            res.send(500, "User logs don't exist");
        } else {
            for (var i = 0; i < candidates.length; ++i) {
                var filepath = dirpath + "/" + candidates[i];
                if(!fs.statSync(filepath).isDirectory()) {
                    files.push(candidates[i]);
                }
            }
            res.send(JSON.stringify({ files: files}));
        }
    });
});

app.post('/log/:user', function(req, res) {
    util.log("POST received at /log/" + req.params.user);
    
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
