var deepcopy = require("deepcopy");

//var sleep = require('sleep');

this.updateNetwork = function(net, inps, bools) {
	var nxtn = [];
	for (var i = 0; i < net.num_neurons; i++) {
		nxtn.push(this.checkNeuron(net, i, inps, bools));
	}
	return nxtn;
};

this.runNetwork = function(step, net, inps, bools) {
	if (step >= 0) {
		return this.runNetwork(step - 1, net, inps, this.updateNetwork(net, inps, bools));
	}
	return bools;
};

this.checkNeuron = function(net, n, inps, bools) {
	var vl = 0.0; //vl //+= net.connections.weight;
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



var express = require('express');
var app = express();

var args = process.argv.slice(2);

if (args.length < 4) {
	console.log("...please input a wait-time between simulations,\n a json file containing a neural network to run, and a json config file to load\n");
}

var net = require("./" + args[1]);
var cfg = require("./" + args[2]);

var that = this;

console.log("starting simulation ...\n");

var rest = require('restling');

var holster = [];

cfg.sensor_urls.forEach(function(ur) {
	holster[ur] = 'na';
});

var swiper = function(url) {
	if (holster[url] === 'na') {
		rest.get('http://' + url).then(function(result) {
			holster[url] = parseFloat(result.data);
			return;
		}, function(error) {
			console.log(error.message);
			//sleep.sleep(0.05);
			//swiper(url);
		});
	}
	return;
};

while (true) {
	
	cfg.sensor_urls.forEach(function(ur) {
		holster[ur] = 'na';
	});
	cfg.sensor_urls.forEach(function(url) {
		swiper(url);
	});
	var ready = false;
	/*while (!ready) {
		ready = true;
		cfg.sensor_urls.forEach(function(url) {
			if(holster[url] === 'na'){
				ready =false;
			}
		});
	}*/
	var inps = [];
	cfg.sensor_urls.forEach(function(ur) {
		inps.push(holster[ur] > net.sensor_thresholds[inps.length]);
	});

	var bools = [];
	for (var i = 0; i < net.num_neurons; i++) {
		bools.push(false);
	}

	var ans = this.runNetwork(35, net, inps, bools);
	rest.get('http://' + cfg.output_url + '?data=' + JSON.stringify(ans)).then(function(result) {
			console.log("to dream no more");
		}, function(error) {
			console.log(error.message);
			console.log("to dream no more");
		});
	//sleep.sleep(parseFloat(args[0]));
};