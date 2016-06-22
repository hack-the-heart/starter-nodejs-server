/**
 * Module dependencies.
 */

var fs = require('fs');
var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');

var app = express();

var dbconn = require("./server/database/dbconn")

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

dbconn.initDBConnection();

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
