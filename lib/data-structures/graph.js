var Node = require('./node')
	, Edge = require('./edge');

/**
 * Represents an graph.
 * @constructor
 */
function Graph() {
	this.nodeList = [];
	this.nodes = {};
	this.edges = {};
}

/**
 * Add a cluster identifier to each {@link Node}.
 * @param {Object} matrix - The output of the MCL algorithm
 */
Graph.prototype.setClusterGroups = function (matrix) {
	this.resetClusterGroups();

	for (var i = matrix.length - 1; i >= 0; i--) {
		for (var j = matrix.length - 1; j >= 0; j--) {
			if (matrix[i][j] > 0 || matrix[j][i] > 0) {
				if (!this.nodeList[j].group) {
					this.nodeList[j].group = i;	
				}
			}
		}
	}
};

/**
 * Reset the cluster identifier from each {@link Node}.
 */
Graph.prototype.resetClusterGroups = function () {
	this.nodeList.forEach(function (node) {
		delete node.group;
	});
};

/**
 * Add a vertex to the graph. If it already exists, it's weight will be increased.
 * @param {String} label - Label for the vertex.
 */
Graph.prototype.addNode = function (label) {
	if (this.nodes[label]) {
		this.nodes[label].weight++;
	} else {
		var node = new Node(label);

		this.nodes[label] = node;
		this.nodeList.push(node);
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
 * Get edge.
 * @param {Node} source - The label of the source
 * @param {Node} target - The label of the target
 * @returns {Edge} - The edge or undefined
 */
Graph.prototype.getEdge = function (source, target) {
	function hashCode(s) {
		return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
	}

	return this.edges[hashCode(source.label) + hashCode(target.label)];
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
	edge.weight = weight;

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