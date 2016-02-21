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
					if(i != j){nnet.connections.push({
						"to": i,
						"from": j,
						"weight": toadd
					});}
				}
			}

			for (var i = outputs; i < nodes; i++) {
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
				nnet.thresholds.push(toadd);
			}

			for (var i = 0; i < sensors; i++) {
				var toadd = Math.random();
				nnet.sensor_thresholds.push(0.5);
			}


			//this.myNet = nnet;
			return nnet;
		}

		//this.bools = [];
		//this.nextBools = [];

		/*this.synergy = 1.05;
		this.degeneration = 0.95;*/
		//this.sbools = [];

		/*this.trainWeights = function(steps, net, test) {
			var inps = test.inps;
			var ops = test.ops;
			for (var i = 0; i < steps; i++) {
				this.synergyStep(net, inps, ops);
			}
		};*/

		/*this.synergyStep = function(net, inps, ops, bools) {
			this.updateNetwork(net, inps);
			for (var i = 0; i < net.connections.length; i++) {
				if (net.connections[i].to != net.connections[i].from) {
					if (bools[net.connections[i].to] && bools[net.connections[i].from]) {
						net.connections[i].weight *= this.synergy;
					} else {
						net.connections[i].weight = net.connections[i].weight * this.degeneration;
					}

					for (var j = 0; j < net.outputs.length; j++) {
						if (bools[net.outputs[j]] && bools[net.connections[i].from]) {
							net.connections[i].weight *= this.synergy;
						}
						if ((!bools[net.outputs[j]]) && bools[net.connections[i].from]) {
							//net.connections[i].weight -= this.synergy;
						}
					}
				}
			}
		};*/

		this.updateNetwork = function(net, inps, bools) {
			var nxtn = [];
			for (var i = 0; i < net.num_neurons; i++) {
				nxtn.push(this.checkNeuron(net, i, inps, bools));
			}
			return nxtn;
		};

		this.runNetwork = function(step, net, inps, bools) {
			//var bools = [];
			//nextBools = [];
			/*for (var i = 0; i < net.num_neurons; i++) {
				bools.push(false);
				nextBools.push(false);
			}*/
			if(step >= 0){
				return this.runNetwork(step - 1, net, inps, this.updateNetwork(net, inps, bools));
			}
			return bools;
		};

		this.checkNeuron = function(net, n, inps, bools) {
			var vl = 0.0;//vl //+= net.connections.weight;
			//0.0;
			//vl += net.connections.weight;
			for (var i = 0; i < net.connections.length; i++) {
				if (net.connections[i].to == n && bools[net.connections[i].from]) {
					vl += net.connections[i].weight;
				}
			}
			for (var i = 0; i < net.inputs.length; i++) {
				if (net.inputs[i].to === n && inps[net.inputs[i].from]) {
					vl += net.inputs[i].weight;
				}
			}
			if (vl > net.thresholds[n]) {
				return true;
			}
			return false;
		};

		this.testCase = function(step, net, test) {
			var tbls = [];
			for (var i = 0; i < net.num_neurons; i++) {
				tbls.push(false);
			}
			//var tst = angular.copy(net);
			var bools = this.runNetwork(step, net, test.inps, tbls);
			for (var i = 0; i < net.outputs.length; i++) {
				if(bools[net.outputs[i]] != test.ops[i]){
					return false;
				}
			}
			return true;
		};

		this.testCases = function(step, net, tests) {
			var tsts = [];
			var that = this;
			tests.forEach(function(test) {
				tsts.push(that.testCase(step, net, test));
			});
			var cnt = 0.0;
			for (var i = 0; i < tsts.length; i++) {
				if (tsts[i]) {
					cnt += 1.0;
				}
			}
			cnt = cnt / tsts.length;
			return cnt;
		};

		this.testCasest = function(step, net, tests) {
			var tsts = [];
			var that = this;
			tests.forEach(function(test) {
				tsts.push(that.testCase(step, net, test));
			});
			var cnt = 0.0;
			for (var i = 0; i < tsts.length; i++) {
				if (tsts[i]) {
					cnt += 1.0;
				}
			}
			cnt = cnt / tsts.length
			return tsts;
		};

		/*this.aggregateWeightLearning = function(step, net, tests) {
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
		};*/

		this.populate = function(ipop, nnodes, sensors, outputs){
			var nns = [];
			for (var i = 0; i < ipop; i++) {
				nns.push(this.makeNetwork(nnodes, sensors, outputs));
			}
			return nns;
		}

		this.evolve = function(stps, pop, step, tests){
			var nns = pop;
			var that = this;
			if (stps < 0 || nns.length < 2) {return pop[0];}
			nns.sort(function(a, b){
				var f1 = that.testCases(step, a, tests);
				var f2 = that.testCases(step, b, tests);
				 if(f1 > f1){
				 	return -1;
				 }
				 if(f2 > f1){
				 	return 1;
				 }
				 return 0;
			});
			//return nns;
			for(var i = 0; i < nns.length; i++){
				this.mutate(nns[i]);
			}
			var nnns = []
			for (var i = 0; i < nns.length/2; i++) {
				nnns.push(this.breed(nns[i], nns[i+1]));
			}
			return this.evolve(stps - 1, nnns, step, tests);
			//return nns;
		};

		this.mutate = function(net){
			for (var i = 0; i < net.connections.length; i++) {
				net.connections[i].weight += (Math.random() - 0.5)/10.0;
			}
			for (var i = 0; i < net.inputs.length; i++) {
				net.inputs[i].weight += (Math.random() - 0.5)/10.0;
			}
			for (var i = 0; i < net.thresholds.length; i++) {
				net.thresholds[i] += (Math.random() - 0.5)/10.0;
			}
			return net;
		}

		this.breed = function(a, b){
			var nm = angular.copy(a);
			for (var i = 0; i < a.connections.length; i++) {
				nm.connections[i].weight = 0.75 * a.connections[i].weight + 0.25 * b.connections[i].weight;
			}
			for (var i = 0; i < a.inputs.length; i++) {
				nm.inputs[i].weight = 0.75 * a.inputs[i].weight + 0.25 * b.inputs[i].weight;
			}
			for (var i = 0; i < a.thresholds.length; i++) {
				nm.thresholds[i].weight = 0.75 * a.thresholds[i].weight + 0.25 * b.thresholds[i].weight;
			}
			return nm;
		}

	}
]);