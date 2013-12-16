var sf = require('slice-file')
	, Analyser = require('./analyser')
	, parse = require('./parser')
	, api = require('./api');

var lines = 1000;

var node = new Analyser();
node.addHeuristic('adjacency');
sf('../../irclogs/Freenode/#node.js.log').follow(-lines).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		node.infer(data);
	}
});

var kapsi = new Analyser();
kapsi.addHeuristic('adjacency');
sf('../../irclogs/IRCnet/#kapsi.fi.log').follow(-lines).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		kapsi.infer(data);
	}
});

var asm = new Analyser();
asm.addHeuristic('adjacency');
sf('../../irclogs/IRCnet/!assembly.log').follow(-lines).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		asm.infer(data);
	}
});



var web = new api({'node': node, 'kapsi': kapsi, 'asm': asm}, {port: 36536});

web.start();
