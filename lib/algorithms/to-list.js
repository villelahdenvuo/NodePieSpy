/** @module toList */

/**
 * Convert a graph to adjacency representation.
 * @param {Object} nodes - The vertices
 * @param {Object} edges - The edges
 * @returns {Object} - The adjacency list representation
 */
module.exports = function toList(nodes, edges) {
	var list = {};

	Object.keys(nodes).forEach(function (node) {
		list[node] = [];
	});

	Object.keys(edges).forEach(function (edge) {
		edge = edges[edge];
		list[edge.source].push(edge.target);
		list[edge.target].push(edge.source);
	});

	return list;
};