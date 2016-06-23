/**
* Module dependencies.
*/

var express = require('express'),
		routes = require('./routes'),
		user = require('./routes/user'),
		allData = require('./routes/allData'),
		http = require('http'),
		path = require('path'),
		fs = require('fs'),
		database = require("./server/database/dbconn");

var app = express();

var db;

var cloudant;

var fileToUpload;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// database setup
var dbCredentials = {
	dbName : 'my_sample_db'
};

if(process.env.VCAP_SERVICES) {
	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	// Pattern match to find the first instance of a Cloudant service in
	// VCAP_SERVICES. If you know your service key, you can access the
	// service credentials directly by using the vcapServices object.
	for(var vcapService in vcapServices){
		if(vcapService.match(/cloudant/i)){
			dbCredentials.host = vcapServices[vcapService][0].credentials.host;
			dbCredentials.port = vcapServices[vcapService][0].credentials.port;
			dbCredentials.user = vcapServices[vcapService][0].credentials.username;
			dbCredentials.password = vcapServices[vcapService][0].credentials.password;
			dbCredentials.url = vcapServices[vcapService][0].credentials.url;

			break;
		}
	}
} else{
	// console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');

	// For running this app locally you can get your Cloudant credentials
	// from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
	// Variables section for an app in the Bluemix console dashboard).
	// Alternately you could point to a local database here instead of a
	// Bluemix service.

	var obj = JSON.parse(fs.readFileSync('config/local-db-info.json', 'utf8'));

	dbCredentials.host = obj.credentials.host;
	dbCredentials.port = obj.credentials.port;
	dbCredentials.user = obj.credentials.username;
	dbCredentials.password = obj.credentials.password;
	dbCredentials.url = obj.credentials.url;
}

cloudant = require('cloudant')(dbCredentials.url);

// check if DB exists if not create
cloudant.db.create(dbCredentials.dbName, function (err, res) {
	if (err) { console.log('could not create db ', err); }
});

db = cloudant.use(dbCredentials.dbName);

if(db==null){
	console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
}

// routes setup
app.get('/', routes.index);
app.get('/alldata', allData.alldata);

// server setup
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
