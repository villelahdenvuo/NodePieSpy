function AdjacencyInference(analyser, config) {
	this.analyser = analyser;
	this.config = config;
}

AdjacencyInference.prototype.infer = function (data) {
	if (this.lastNick && this.lastNick !== data.nick) {
		this.analyser.addEdge(data.nick, this.lastNick, this.config.weight);
	}
	this.lastNick = data.nick;
};

module.exports = AdjacencyInference;