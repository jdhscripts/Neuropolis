var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());


var args = process.argv.slice(2);
app.set("port", args[0]);

var currentData = []

app.post('/', function (req, res) {

	currentData = req.body;
	console.log(currentData);
});

app.all('/', function (req, res) {
  console.log(currentData);
});

// app.listen(parseInt(args[0]));
app.listen(app.get('port'), function(){
        console.log('Server is listening on port ' +
            app.get('port'));
    });