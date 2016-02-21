var express = require('express');
var app = express();

var args = process.argv.slice(2);

app.get('/', function (req, res) {
	console.log(JSON.stringify(req.query.data));
  res.end();
});

app.listen(parseInt(args[0]), function () {
  console.log('Example app listening on port ' + args[0] + '!');
});
