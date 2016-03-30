// ES5
// Example. Do not use in production
var express = require('express');
var app = express();
var compression = require('compression');

//require('chokidar-socket-emitter')({app: server.server});
//server.listen(9080);

var chokidarEvEmitter = require('chokidar-socket-emitter');
chokidarEvEmitter({port: 5776, path: "app"}); //path is taken from jspm/directories/baseURL or if that is not set up, '.' is used
//or specify the path
//chokidarEvEmitter({port: 8090, path: '.'});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.listen(3000, function () {
  console.log('Magpie Dev Server listening on port 3000!');
});

app.use(compression());

app.use('/', express.static(__dirname + '/web'));

app.use('/config.js', express.static(__dirname + '/config.js'));

app.use('/app', express.static(__dirname + '/app'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/jspm_packages', express.static(__dirname + '/jspm_packages'));

