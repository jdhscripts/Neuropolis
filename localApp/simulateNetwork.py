import exceptions
import json
import httplib


def main(): 
	neuralNet = load_neural_net('../testData/andNet.json')
	# process_neural_net(neuralNet)

def load_neural_net(json_path):
	with open(json_path) as data_file:
		data = json.load(data_file)
		
		connections = data["connections"]
		
		sensor_ports = data["sensors"]
		inputs = data["inputs"]

		num_neurons = data["num_neurons"]
		outputs = data["outputs"]
		thresholds = data["thresholds"]
		sensor_thresholds = data["sensor_thresholds"]
		remainingRuns = data["timesteps"]

		# initialize neurons
		neurons = []
		for k in range(num_neurons):
			neurons.append(Neuron(thresholds[k]))

		# add connections
		for connection in connections:
			parse_neuron_connection(connection, neurons)

		for k in range(len(sensor_ports)):
			port = sensor_ports[k]
			threshold = sensor_thresholds[k]
			new_sensor = Sensor(threshold, port)
			neurons.append(new_sensor)

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
		remainingRuns -= 1

	def getOutput(self):
		finalOut = []
		for i in self.outputs:
			finalOut.append(self.neurons[i])
		return finalOut


class Sensor():

	def __init__(self, threshold, port):
		self.value = 0
		self.port = port
		self.threshold = threshold
		self.isActive = False
		self.nextActive = False 

	def setNextState(self):

		conn = httplib.HTTPConnection('http://' + self.port) # TODO
		conn.request("HEAD", "/index.html")
		result = conn.getResponse()
		print(result)

	def update(self): 
		if self.nextActive == None:
			raise exceptions.NextStateNullException()
		self.isActive = self.nextActive
		self.nextActive = None


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
		inputs = []
		for neuron in self.inputs:
			if neuron.isActive:
				inputs.append(value)
		if self.aggregate(inputs) > self.threshold:
			self.nextActive = True
		else:
			self.nextActive = False

	def update(self):
		if self.nextActive == None:
			raise exceptions.NextStateNullException()
		self.isActive = self.nextActive
		self.nextActive = None


if __name__ == "__main__":
	main()