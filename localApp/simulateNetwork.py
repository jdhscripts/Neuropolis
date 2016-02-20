import exceptions


def main(): 
	neuralNet = loadNeuralNet()
	processNeuralNet(neuralNet)

def loadNeuralNet():
	pass

def loadNeuron():
	pass

def processNeuralNet(neuralNet):
	while(neuralNet.remainingRuns > 0):
		neuralNet.timeStep()

class NeuralNet():

	def __init__(self):
		self.neurons = []
		self.remainingRuns

	def timeStep():
		for neuron in self.neurons:
			neuron.setNextState()
		for neuron in self.neurons:
			neuron.update()
		remainingRuns -= 1


class Sensor():

	def __init__(self, threshold):
		self.value = 0
		self.threshold = threshold
		self.isActive = False
		self.nextActive = False 

	def update(): 
		if self.nextActive = None:
			raise exceptions.NextStateNullException()
		self.isActive = self.nextActive
		self.nextActive = None


class Neuron():

	def __init__(self), threshold:
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
			if neuron.isActive
			inputs.append(value)
		if self.aggregate(inputs) > self.threshold:
			self.nextActive = True
		else:
			self.nextActive = False

	def update(self):
		if self.nextActive = None:
			raise exceptions.NextStateNullException()
		self.isActive = self.nextActive
		self.nextActive = None



if __name__ == "__main__":
	main()