require('app-module-path').addPath(__dirname + '/');

const path = require('path');
global.__basePath = path.resolve(__dirname);

const fs   = require('fs'),
	dotenv = require('dotenv');

//Asignacion de variables de ambiente
const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (var k in envConfig) {
	process.env[k] = envConfig[k]
}

const express           = require('express'),
	http                = require('http'),
	cookieParser        = require('cookie-parser'),
	bodyParser          = require('body-parser'),
	compression         = require('compression'),
	multipartMiddleware = require("connect-multiparty")(),
	helmet              = require('helmet'),
	serverConfig        = require('config').server;

const App    = express();

App.enable('trust proxy');
App.disable('x-powered-by');
App.use(helmet());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(cookieParser());
App.use(multipartMiddleware);

App.use(express.static(__dirname + '/public'));

App.use('', express.static(path.join(__dirname, 'public')));

const API_VERSIONS = {'Dev': '/v0', 'Version 1': '/v1'};

App.get("/versiones", (req, res) => res.status(200).json(API_VERSIONS) );

Object.keys(API_VERSIONS).forEach(function(k) {
    App.use(`/api${API_VERSIONS[k]}`, require(`routes/Http${API_VERSIONS[k]}`));
});

// catch 404 and forward to error handler
App.use((req, res, next) => {

	let err = null;

	try {
		throw new Error('No se encuentra');
	} catch (e) {
		err = e;
	}
	
	err.status = 404;
	next(err);
});

// error handler
App.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send({ error: err.message });
});

const server = App.listen(serverConfig.port, () => {
	console.clear()
	let env = process.env.NODE_ENV == "development" ? "DESARROLLO" : "PRODUCCIÓN"
	console.log(`Servidor corriendo en ambiente: ${env}, URL: http://${serverConfig.server}:${serverConfig.port}`);
});

const io = require('socket.io')(server),
	ws   = require('routes/Ws');

ws(io);


module.exports = App;