var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var args = process.argv.slice(2);
app.set("port", args[0]);

app.post('/', function (req, res) {
	console.log(req.body);
});

app.all('/', function (req, res) {
  console.log("in all");
});

// app.listen(parseInt(args[0]));
app.listen(app.get('port'), function(){
        console.log('Server is listening on port ' +
            app.get('port'));
    });