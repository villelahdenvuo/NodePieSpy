	var parser = require('./parser')
	, cjson = require('cjson')
	, Graph = require('./data-structures/graph');

var toList = require('./algorithms/to-list')
	, toMatrix = require('./algorithms/to-matrix')
	, bfs = require('./algorithms/bfs')
	, cluster = require('./algorithms/cluster');

/**
 * Analyser is an object that is used to analyse a graph.
 * @constructor
 * @param {Object} config - Values to override default configuration.
 */
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
	};
	this.config = cjson.extend(defaults, config);

	this.config.postfixes = this.config.postfixes.map(function (f) {
		return new RegExp(f + '+$');
	});

	this.heuristics = [];

	this.graph = new Graph();
}

/**
 * Add a new heuristic to the analyser.
 * @param {String} name - Name of the heuristic, it will be loaded from heuristics folder.
 */
Analyser.prototype.addHeuristic = function (name) {
	this.heuristics.push(new (require('./heuristics/' + name))(this, this.config.heuristics[name]));
};

/**
 * Processes a piece of data with currently active heuristics.
 * @param {Object} data - Data object
 */
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

/**
 * Compute an adjacency list representation of the graph.
 * @returns {Array} - An adjacency list representation of the graph
 */
Analyser.prototype.getList = function () {
	return toList(this.graph);
};

/**
 * Compute an adjacency matrix representation of the graph.
 * @returns {Array} - An adjacency matrix representation of the graph
 */
Analyser.prototype.getMatrix = function () {
	return toMatrix(this.graph);
};

/**
 * Compute a breadth-first-tree from the graph.
 * @param {String} label - The label to start the bfs from.
 * @returns {Array} - A tree represented as an path array.
 */
Analyser.prototype.bfs = function (start) {
	return bfs(start, toList(this.graph));
};

/**
 * Compute clusters.
 * @returns {Array} - A matrix containing the clusters.
 */
Analyser.prototype.getClusters = function (inflation) {
	var clusters = cluster(this.graph, 2, inflation);
	this.graph.setClusterGroups(clusters);
	return this.graph;
};

module.exports = Analyser;