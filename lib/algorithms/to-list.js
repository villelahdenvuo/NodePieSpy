/** @module toList */

/**
 * Convert a graph to adjacency representation.
 * @param {Graph} graph - The graph
 * @returns {Object} - The adjacency list representation
 */
module.exports = function toList(graph) {
	var list = {};

	Object.keys(graph.nodes).forEach(function (node) {
		list[node] = [];
	});

	Object.keys(graph.edges).forEach(function (edge) {
		edge = graph.edges[edge];
		list[edge.source].push(edge.target);
		list[edge.target].push(edge.source);
	});

	return list;
};