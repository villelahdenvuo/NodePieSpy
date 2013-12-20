var toList = require('./to-list');

function bfs(start, list) {
	var queue = [start]
		, visited = {}
		, path = {};

	path[start] = null;
	visited[start] = true;

	while(queue.length) {
		var v = queue.pop();
		var pals = list[v];
		for (var i = pals.length - 1; i >= 0; i--) {
			var u = pals[i];
			if (!visited[u]) {
				path[u] = v;
				queue.unshift(u);
				visited[u] = true;
			}
		}
	}

	return path;
}

module.exports = bfs;