// We need an express application to run a webserver
var express = require('express');
var path = require('path');
var expressApp = express();

expressApp.set("port", process.env.PORT || 3000);

// Express middleware
expressApp
    .use(express.static('./'))
    .get('*', function(req, res){
        res.sendFile('index.html',
            {root: path.join(__dirname, './')});
    })
    .listen(expressApp.get('port'), function(){
        console.log('Server is listening on port ' +
            expressApp.get('port'));
    });