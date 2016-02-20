var request = require('request');

var requestData = {
  "data" : "asdaw"
};

request('localhost:3001',
        { json: true, body: requestData },
        function(err, res, body) {
        	console.log(res);
  // `body` is a js object if request was successful
});