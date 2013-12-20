var parser = require('./parser')
	, cjson = require('cjson')
	, Node = require('./data-structures/node')
	, Edge = require('./data-structures/edge');

var toList = require('./algorithms/to-list')
	, bfs = require('./algorithms/bfs');

function Analyser(config) {
	var defaults = {
		aliases: {
			'bjuutie': 'Bjuuti',
		},
		postfixes: ['_', '\\^', '-'],
		ignores: ['pyfibot'],
		relationshipDecay: 0.0001,
		activityDecay: 0.001,
		heuristics: {
			'adjacency': {
				weight: 1
			}
		}
	}
	this.config = cjson.extend(defaults, config);

	this.config.postfixes = this.config.postfixes.map(function (f) {
		return new RegExp(f + '+$');
	});

	this.heuristics = [];

	this.nodes = {};
	this.edges = {};
}

Analyser.prototype.addHeuristic = function (name) {
	this.heuristics.push(new (require('./heuristics/' + name))(this, this.config.heuristics[name]));
};

Analyser.prototype.infer = function (data) {
	var config = this.config, nickLC = data.nick.toLowerCase();

	config.postfixes.forEach(function (f) {
		data.nick = data.nick.replace(f, '');
	});

	if (config.ignores.indexOf(nickLC) !== -1) {
		return;
	}

	if (nickLC in config.aliases) {
		data.nick = config.aliases[nickLC];
	}

	this.heuristics.forEach(function (heuristic) {
		heuristic.infer(data);
	});
};

Analyser.prototype.addNode = function (nick) {
	if (this.nodes[nick]) {
		this.nodes[nick].weight++;
	} else {
		this.nodes[nick] = new Node(nick);
	}
};

Analyser.prototype.hasNode = function (nick) {
	return nick in this.nodes;
};

Analyser.prototype.addEdge = function (source, target, weight) {
	//console.log('adding edge', source + '-' + target);
	if (source == target || weight < 0) {
		return;
	}

	this.addNode(source);
	this.addNode(target);

	var edge = new Edge(source, target);

	if (this.edges[edge.toString()]) {
		this.edges[edge.toString()].weight++;
	} else {
		this.edges[edge.toString()] = edge;
	}
};

Analyser.prototype.removeNode = function (nick) {
	if (this.nodes[nick]) {
		delete this.nodes[nick];

		this.edges = this.edges.filter(function (edge) {
			if (edge.source == nick || edge.target == nick) {
				return false;
			} else {
				return true;
			}
		});
	}
};

Analyser.prototype.getList = function () {
	return toList(this.nodes, this.edges);
};

Analyser.prototype.bfs = function(start) {
	return bfs(start, toList(this.nodes, this.edges));
};

module.exports = Analyser;