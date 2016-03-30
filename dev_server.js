// ES5
// Example. Do not use in production
var express = require('express');
var app = express();
var compression = require('compression');


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