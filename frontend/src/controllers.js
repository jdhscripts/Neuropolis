var app = angular.module('neuropolis');

app.controller('NeuralNetController', ['NeuralNet', function(NeuralNet){
	//this.net = NeuralNet.myNet;
	NeuralNet.makeNetwork(5,2,1);
	//Inputs = [true,true];
	//Outputs = [true];
	tests = [
	{inps : [true, true], ops : [true]},
	{inps : [true, false], ops : [false]},
	{inps : [false, true], ops : [false]},
	{inps : [false, false], ops : [false]}
	];
	NeuralNet.aggregateWeightLearning(25,NeuralNet.myNet,tests);
	this.net = NeuralNet.myNet;
}]);