import json
import urllib2
import sys


def main():
	if len(sys.argv) < 2:
		exit("incorrect number of arguments")
	neural_net_file = sys.argv[0]
	config_file = sys.argv[1]
	neuralNet = load_neural_net(neural_net_file, config_file)
	process_neural_net(neuralNet)
	output_array = neuralNet.getOutput()

	with open(config_file) as data_file:
		data = json.load(data_file)
		output_url = data['output_url']
		deliver_outpout(output_array, output_url)

def deliver_outpout(output_array, output_url):
	data = {"output": output_array}
	request = urllib2.Request("http://" + output_url)
	request.add_header('neural-net output', 'application-json')
	urllib2.urlopen(request, json.dumps(data))


def load_neural_net(json_path, json_config):
	with open(json_path) as data_file:
		data = json.load(data_file)
		
		connections = data["connections"]
		
		num_sensors = data["sensors"]
		inputs = data["inputs"]

		num_neurons = data["num_neurons"]
		outputs = data["outputs"]
		thresholds = data["thresholds"]
		sensor_thresholds = data["sensor_thresholds"]
		remainingRuns = data["timesteps"]

	with open(json_config) as data_file:
		data = json.load(data_file)
		sensor_urls = data['sensor_urls']

	# initialize neurons
	neurons = []
	for k in range(num_neurons):
		neurons.append(Neuron(thresholds[k]))
	# add connections
	for connection in connections:
		parse_neuron_connection(connection, neurons)

	sensors = []
	for k in range(num_sensors):
		url = sensor_urls[k]
		threshold = sensor_thresholds[k]
		new_sensor = Sensor(threshold, url)
		sensors.append(new_sensor)
	for inputPath in inputs:
		neurons[inputPath["to"]].inputs[sensors[inputPath["from"]]] = inputPath["weight"]

	return NeuralNet(neurons, outputs, remainingRuns)


def parse_neuron_connection(connection, neurons):
	"""parsses the given connection, and addes it to the connections map of the correct neuron"""
	neuron = neurons[connection["to"]]
	neuron.inputs[neurons[connection["from"]]] = connection["weight"]
	return neuron

def process_neural_net(neuralNet):
	while(neuralNet.remainingRuns > 0):
		neuralNet.timeStep()


class NeuralNet():

	def __init__(self, neurons, outputs, remainingRuns):
		self.neurons = neurons
		self.outputs = outputs
		self.remainingRuns = remainingRuns

	def timeStep(self):
		for neuron in self.neurons:
			neuron.setNextState()
		for neuron in self.neurons:
			neuron.update()
		self.remainingRuns -= 1

	def getOutput(self):
		finalOut = []
		for i in self.outputs:
			finalOut.append(self.neurons[i].isActive)
		return finalOut


class Sensor():

	def __init__(self, threshold, url):
		response = urllib2.urlopen('http://' + url)
		self.value = float(response.read())
		self.threshold = threshold
		self.isActive = self.value > self.threshold

	def setNextState(self):
		pass

	def update(self): 
		pass


class Neuron():

	def __init__(self, threshold):
		# inputs = {node: weight}
		self.inputs = {}
		self.threshold = threshold
		self.isActive = False
		self.nextActive = False

	def aggregate(self, ls):
		return sum(ls)

	def setNextState(self):
		activeInputs = []
		for neuron in self.inputs:
			if neuron.isActive:
				value = self.inputs[neuron]
				activeInputs.append(value)
		if self.aggregate(activeInputs) > self.threshold:
			self.nextActive = True
		else:
			self.nextActive = False

	def update(self):
		if self.nextActive == None:
			raise NextStateIsNullException()
		self.isActive = self.nextActive
		self.nextActive = None


class NextStateIsNullException(Exception):

	def __init__(self):
		pass

class ConfigFileConflictingDataException(Exception):

	def __init__(self):
		pass


if __name__ == "__main__":
	main()