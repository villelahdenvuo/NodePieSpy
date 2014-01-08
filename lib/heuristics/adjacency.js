/**
 * AdjacencyInference is a class that infers social information from
 * data chunks based on adjacency.
 * @constructor
 * @param {Analyser} analyser - Analyser to update
 * @param {Object} config - Configuration for the heuristic
 */
function AdjacencyInference(analyser, config) {
	this.analyser = analyser;
	this.config = config;
}

/**
 * Process data chunk.
 * @param {Object} data - Data chunk
 */
AdjacencyInference.prototype.infer = function (data) {
	if (this.lastNick && this.lastNick !== data.nick) {
		this.analyser.graph.addEdge(data.nick, this.lastNick, this.config.weight);
	}
	this.lastNick = data.nick;
};

module.exports = AdjacencyInference;