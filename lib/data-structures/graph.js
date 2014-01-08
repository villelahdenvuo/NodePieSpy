var Node = require('./node')
	, Edge = require('./edge');

/**
 * Represents an graph.
 * @constructor
 */
function Graph() {
	this.nodes = {};
	this.edges = {};
}

/**
 * Add a vertex to the graph. If it already exists, it's weight will be increased.
 * @param {String} label - Label for the vertex.
 */
Graph.prototype.addNode = function (label) {
	if (this.nodes[label]) {
		this.nodes[label].weight++;
	} else {
		this.nodes[label] = new Node(label);
	}
};

/**
 * Check if a given label exists in the graph.
 * @param {String} label - The label to check
 * @returns {Boolean} - Whether the label is in the graph or not
 */
Graph.prototype.hasNode = function (label) {
	return label in this.nodes;
};

/**
 * Add an edge between two vertices. If it already exists, it's weight will be increased.
 * @param {String} source - From vertex
 * @param {String} target - To vertex
 * @param {Number} weight - Weight of the edge
 */
Graph.prototype.addEdge = function (source, target, weight) {
	if (source === target || weight < 0) {
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

/**
 * Remove a vertex by it's label.
 * @param {String} label - The label to remove
 */
Graph.prototype.removeNode = function (label) {
	if (this.nodes[label]) {
		delete this.nodes[label];

		this.edges = this.edges.filter(function (edge) {
			if (edge.source === label || edge.target === label) {
				return false;
			} else {
				return true;
			}
		});
	}
};

module.exports = Graph;