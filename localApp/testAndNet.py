import simulateNetwork as sim



def test():
	print "testing And-gate neural net"
	neural_net = sim.load_neural_net('../testData/andNet.json', '../testData/andNetCFG.json')
	# MOCK Inputs
	sim.process_neural_net(neural_net)
	print neural_net.getOutput()
	sim.deliver_outpout(neural_net.getOutput(), 'localhost:3003/')


if __name__ == "__main__":
	test()
