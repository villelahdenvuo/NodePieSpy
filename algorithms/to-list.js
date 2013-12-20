function toList(nodes, edges) {
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
}

module.exports = toList;