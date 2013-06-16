var sf = require('slice-file')
	, Analyser = require('./analyser')
	, parse = require('./parser')
	, api = require('./api');

var node = new Analyser();
node.addHeuristic('adjacency');
sf('../../irclogs/Freenode/#node.js.log').follow(-300).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		node.infer(data);
	}
});

var kapsi = new Analyser();
kapsi.addHeuristic('adjacency');
sf('../../irclogs/IRCnet/#kapsi.fi.log').follow(-300).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		kapsi.infer(data);
	}
});

var mc = new Analyser();
mc.addHeuristic('adjacency');
sf('../../irclogs/IRCnet/#minecraft.log').follow(-300).on('data', function (chunk) {
	var data = parse(chunk);
	if (data) {
		mc.infer(data);
	}
});



var web = new api({'node': node, 'kapsi': kapsi, 'mc': mc}, {port: 36536});

web.start();