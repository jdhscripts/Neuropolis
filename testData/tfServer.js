var express = require('express');
var app = express();

var args = process.argv.slice(2);

app.get('/', function (req, res) {
  res.sendStatus(parseFloat(args[0]));
});

app.listen(parseInt(args[1]), function () {
  console.log('Example app listening on port ' + args[1] + '!');
});