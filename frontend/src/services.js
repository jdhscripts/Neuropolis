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
				nnet.thresholds.push(toadd);
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

		this.synergy = 0.3;
		this.degeneration = 0.0;
		//this.sbools = [];

		this.trainWeights = function(steps, net, inps, ops){
			for (var i = 0; i < steps; i++) {
				this.synergyStep(net,inps, ops);
			}
		};

		this.synergyStep = function(net, inps, ops) {
			this.updateNetwork(net,inps);
			for (var i = 0; i < net.connections.length; i++) {
				if(net.connections[i].to != net.connections[i].from){
					if(this.bools[net.connections[i].to] && this.bools[net.connections[i].from]){
						net.connections[i].weight += this.synergy;
					}
					else{
						net.connections[i].weight = net.connections[i].weight * this.degeneration;
					}

					for (var j = 0; j < net.outputs.length; j++) {
						if (this.bools[net.outputs[j]] && this.bools[net.connections[i].from]) {
							net.connections[i].weight += this.synergy;
						}
						if ((!this.bools[net.outputs[j]]) && this.bools[net.connections[i].from]) {
							net.connections[i].weight -= this.synergy;
						}
					}
				}
			}
		};

		this.updateNetwork = function(net,inps) {
			for (var i = 0; i < net.nodes; i++) {
				this.checkNeuron(net,i,inps);
			}
			for (var i = 0; i < net.nodes; i++) {
				this.bools[i] = this.nextBools[i];
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
			if (vl > net.thresholds[n]) {this.nextBools[n] = true; return true;}
			this.nextBools[n] = false;
			return false;
		};

	}
]);