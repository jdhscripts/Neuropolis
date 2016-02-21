var app = angular.module('neuropolis');

app.controller('NeuralNetController', ['NeuralNet', function(NeuralNet){
	//this.net = NeuralNet.myNet;
	//NeuralNet.makeNetwork(20,2,1);
	//Inputs = [true,true];
	//Outputs = [true];
	tests = [
	{inps : [true, true], ops : [true]},
	{inps : [true, false], ops : [false]},
	{inps : [false, true], ops : [false]},
	{inps : [false, false], ops : [false]}
	];

	net = {
	"num_neurons" : 3,
	"connections" : [
			{"to" : 2, "from" : 0, "weight" : 1.0},
			{"to" : 2, "from" : 1, "weight" : 1.0}
		],
	"sensors" : 2,
	"inputs" : [
			{"to" : 0, "from" : 0, "weight" : 1.0},
			{"to" : 1, "from" : 1, "weight" : 1.0}
		],
	"outputs" : [2],
	"thresholds" : [0.0,0.0,1.5],
	"sensor_thresholds" : [0.5,0.5],
	"timesteps" : 9
};
	//NeuralNet.aggregateWeightLearning(400,NeuralNet.myNet,tests);
	this.nets = NeuralNet.populate(100, 5, 2, 1);
	//this.net = //[this.nets[0],this.nets[1],NeuralNet.breed(this.nets[0], this.nets[1])];

	this.net = NeuralNet.evolve(10, this.nets, 32, tests);
	//this.val = [NeuralNet.testCases(25, this.net, tests),NeuralNet.testCases(25, this.net[this.net.length - 1], tests)];
	this.val = NeuralNet.testCases(32, this.net, tests);
	//var bools = [false, false, false];
	//var inps = [true, true];
	//this.val = NeuralNet.updateNetwork(net, inps, bools);//
	//this.val = NeuralNet.runNetwork(25, net, [true, true], [false, false, false]);
	//this.net = NeuralNet.myNet;
	//this.net.connections = this.net.connections;//.filter(function(el){true});
}]);