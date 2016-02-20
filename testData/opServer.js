var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

var args = process.argv.slice(2);

app.post('/', function(request, response){
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
});

console.log('listening on port ' + args[0] + '!');
app.listen(parseInt(args[0]));