/** @module toMatrix */

/**
 * Convert a graph to adjacency representation.
 * @param {Graph} graph - The graph
 * @returns {Object} - The adjacency matrix representation
 */
module.exports = function toMatrix(graph) {
	var matrix = [];

	for (var i = graph.nodeList.length - 1; i >= 0; i--) {
		var row = [];
		for (var j = graph.nodeList.length - 1; j >= 0; j--) {
			var edge = graph.getEdge(graph.nodeList[i], graph.nodeList[j]);

			if (i === j) { edge = { weight: 1 }; }
			row.push(edge && edge.weight || 0);
		}
		matrix.push(row);
	}

	return matrix;
};