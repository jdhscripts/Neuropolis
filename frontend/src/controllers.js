var app = angular.module('neuropolis');

app.controller('NeuralNetController',['NeuralNet', function(NeuralNet){
	this.net = NeuralNet.myNet;
	NeuralNet.makeNetwork(4,2,2);
}]);