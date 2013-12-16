var parser = require('./parser')
	, cjson = require('cjson')
	, Node = require('./node');

function Analyser(config) {
	var defaults = {
		aliases: {},
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

	this.heuristics = [];

	this.nodes = {};
	this.edges = {};
}

Analyser.prototype.addHeuristic = function (name) {
	this.heuristics.push(new (require('./heuristics/' + name))(this, this.config.heuristics[name]));
};

Analyser.prototype.infer = function (data) {
	if (this.config.ignores.indexOf(data.nick.toLowerCase()) !== -1) {
		return;
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

module.exports = Analyser;


function Edge(source, target) {
	this.source = source;
	this.target = target;
	this.weight = 0;
}

Edge.prototype.toString = function () {
	return hashCode(this.source) + hashCode(this.target);
};


function hashCode(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0); 
}