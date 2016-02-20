import simulateNetwork as sim


def test():
	result = test00()
	result = result & test01()
	result = result & test10()
	result = result & test11()

	if result:
		print('all tests passed!')
	else:
		print('test cases failed')


def test00():
	neural_net = sim.load_neural_net('../testData/andNet.json')
	# MOCK Inputs
	sim.process_neural_net(neural_net)
	if neural_net.getOutput():
		print('0 & 0 returned 1')
		print('test00 FAILED')
		return False
	return True


def test01():
	neural_net = sim.load_neural_net('../testData/andNet.json')
	# MOCK Inputs
	sim.process_neural_net(neural_net)
	if neural_net.getOutput():
		print('0 & 1 returned 1')
		print('test01 FAILED')
		return False
	return True


def test10():
	neural_net = sim.load_neural_net('../testData/andNet.json')
	# MOCK Inputs
	sim.process_neural_net(neural_net)
	if neural_net.getOutput():
		print('1 & 0 returned 1')
		print('test10 FAILED')
		return False
	return True



def test11():
	neural_net = sim.load_neural_net('../testData/andNet.json')
	# MOCK Inputs
	sim.process_neural_net(neural_net)
	if not neural_net.getOutput():
		print('1 & 1 returned 0')
		print('test11 FAILED')
		return False
	return True


if __name__ == "__main__":
	test()