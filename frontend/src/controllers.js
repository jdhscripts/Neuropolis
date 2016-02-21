var app = angular.module('neuropolis');

app.controller('NeuralNetController', ['NeuralNet', function(NeuralNet){
	//this.net = NeuralNet.myNet;
	NeuralNet.makeNetwork(20,2,1);
	//Inputs = [true,true];
	//Outputs = [true];
	tests = [
	{inps : [true, true], ops : [true]},
	{inps : [true, false], ops : [false]},
	{inps : [false, true], ops : [false]},
	{inps : [false, false], ops : [false]}
	];
	NeuralNet.aggregateWeightLearning(400,NeuralNet.myNet,tests);
	this.net = NeuralNet.myNet;
	this.net.connections = this.net.connections;//.filter(function(el){true});
}]);