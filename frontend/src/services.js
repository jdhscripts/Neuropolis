var app = angular.module('neuropolis');

app.service('NeuralNet', ['$http',
	function($http) {
		this.makeNetwork = function(nnodes, sensors, outputs) {
			var nodes = nnodes;
			if (nnodes < outputs) {
				nodes = outputs
			}

			var nnet = {
				"num_neurons": nodes,
				"connections": [],
				"sensors": sensors,
				"inputs": [],
				"outputs": [],
				"thresholds": [],
				"sensor_thresholds": [],
				"timesteps": (nodes * nodes)
			}

			for (var i = 0; i < nodes; i++) {
				for (var j = 0; j < nodes; j++) {
					var toadd = Math.random();
					nnet.connections.push({
						"to": i,
						"from": j,
						"weight": toadd
					});
				}
			}

			for (var i = 0; i < nodes; i++) {
				for (var j = 0; j < sensors; j++) {
					var toadd = Math.random();
					nnet.inputs.push({
						"to": i,
						"from": j,
						"weight": toadd
					});
				}
			}

			for (var i = 0; i < outputs; i++) {
				nnet.outputs.push(i);
			}

			for (var i = 0; i < nodes; i++) {
				var toadd = Math.random();
				nnet.thresholds.push(0.5);
			}

			for (var i = 0; i < sensors; i++) {
				//var toadd = Math.random();
				nnet.sensor_thresholds.push(0.5);
			}


			this.myNet = nnet;
			return nnet;
		}

		this.myNet = {};
		this.state = {};
		this.bools = [];
		this.nextBools = [];

		this.synergy = 2.0;
		this.degeneration = 0.9;
		//this.sbools = [];

		this.trainWeights = function(steps, net, test) {
			var inps = test.inps;
			var ops = test.ops;
			for (var i = 0; i < steps; i++) {
				this.synergyStep(net, inps, ops);
			}
		};

		this.synergyStep = function(net, inps, ops) {
			this.updateNetwork(net, inps);
			for (var i = 0; i < net.connections.length; i++) {
				if (net.connections[i].to != net.connections[i].from) {
					if (this.bools[net.connections[i].to] && this.bools[net.connections[i].from]) {
						net.connections[i].weight *= this.synergy;
					} else {
						net.connections[i].weight = net.connections[i].weight * this.degeneration;
					}

					for (var j = 0; j < net.outputs.length; j++) {
						if (this.bools[net.outputs[j]] && this.bools[net.connections[i].from]) {
							net.connections[i].weight *= this.synergy;
						}
						if ((!this.bools[net.outputs[j]]) && this.bools[net.connections[i].from]) {
							//net.connections[i].weight -= this.synergy;
						}
					}
				}
			}
		};

		this.updateNetwork = function(net, inps) {
			for (var i = 0; i < net.nodes; i++) {
				this.checkNeuron(net, i, inps);
			}
			for (var i = 0; i < net.nodes; i++) {
				this.bools[i] = this.nextBools[i];
			}
		};

		this.runNetwork = function(step, net, inps) {
			for (var i = 0; i < step; i++) {
				updateNetwork(net, inps);
			}
		};

		this.checkNeuron = function(net, n, inps) {
			var vl = vl += net.connections.weight;
			0.0;
			vl += net.connections.weight;
			for (var i = 0; i < net.connections.length; i++) {
				if (net.connections[i].to == n && this.bools[net.connections[i].from]) {
					vl += net.connections[i].weight;
				}
			}
			for (var i = 0; i < net.inputs.length; i++) {
				if (net.inputs[i].to == n && this.inps[net.connections[i].from]) {
					vl += net.inputs[i].weight;
				}
			}
			if (vl > net.thresholds[n]) {
				this.nextBools[n] = true;
				return true;
			}
			this.nextBools[n] = false;
			return false;
		};

		this.testCase = function(step, net, test) {
			var tst = angular.copy(net);
			this.runNetwork(step, net, test.inps);
			var chk = true;
			for (var i = 0; i < net.outputs.length; i++) {
				chk = chk && (net.outputs[i] == test.ops[i]);
			}
			return chk;
		};

		this.testCases = function(step, net, tests) {
			var tsts = [];
			tests.forEach(function(test) {
				tsts.push(this.testCase(step, net, test));
			});
			var cnt = 0.0;
			for (var i = 0; i < tsts.length; i++) {
				if (tsts[i]) {
					cnt += 1.0;
				}
			}
			cnt = cnt / tsts.length
			return cnt;
		};

		this.aggregateWeightLearning = function(step, net, tests) {
			nets = [];
			for (var i = 0; i < tests.length; i++) {
				var nnn = angular.copy(net);
				this.trainWeights(step, nnn, tests[i]);
				nets.push(nnn);
			}
			for (var i = 0; i < nets.length; i++) {
				this.trainWeights(step, nets[i], tests[i]);
			}
			for (var i = 0; i < net.connections.length; i++) {
				net.connections[i].weight = 0.0;
			}
			for (var i = 0; i < tests.length; i++) {
				for (var j = 0; j < net.connections.length; j++) {
					net.connections[j].weight += nets[i].connections[j].weight;
				}
			}
			for (var i = 0; i < net.connections.length; i++) {
				net.connections[i].weight = net.connections[i].weight / nets.length;
			}
		};

	}
]);