var app = angular.module('neuropolis');

app.controller('NeuralNetController', ['NeuralNet', function(NeuralNet){
	//this.net = NeuralNet.myNet;
	NeuralNet.makeNetwork(5,2,1);
	Inputs = [true,true];
	Outputs = [true];
	NeuralNet.trainWeights(25,NeuralNet.myNet,Inputs,Outputs);
	this.net = NeuralNet.myNet;
}]);