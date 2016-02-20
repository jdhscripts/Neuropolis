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
					nnet.connections.push({
						"to": i,
						"from": j,
						"weight": 0.0
					});
				}
			}

			for (var i = 0; i < nodes; i++) {
				for (var j = 0; j < sensors; j++) {
					nnet.inputs.push({
						"to": i,
						"from": j,
						"weight": 0.0
					});
				}
			}

			for (var i = 0; i < outputs; i++) {
				nnet.outputs.push(i);
			}

			for (var i = 0; i < nodes; i++) {
				nnet.thresholds.push(0);
			}

			myNet = nnet;
			return nnet;
		}

		this.myNet = {};

	}
]);