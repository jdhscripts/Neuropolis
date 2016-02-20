var app = angular.module('neuropolis');

app.service('NeuronMaker', ['$http', function($http){
        this.getConvertedData = function(path, callback){
        $http({method: 'GET', url: path})
            .then(function(response){
                callback(response.data);
            }, function(response){
                console.log('Failure');
                console.log(response);
            });
        };
    }]);