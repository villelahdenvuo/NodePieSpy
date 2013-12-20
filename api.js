
var express = require('express')
	, cors = require('cors');

function WebAPI(analysers, config) {
	this.analysers = analysers;
	var app = this.api = express();
	this.config = config;

	app.configure(function(){
	  app.use(express.compress());
	});
}

WebAPI.prototype.getChannel = function (req, res) {
	var channel = req.params.channel;

	if (!(channel in this.analysers)) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Resource not found.');
		return;
	}

	var analyser = this.analysers[channel];

	res.send({
		nodes: analyser.nodes,
		edges: analyser.edges
	});
};

WebAPI.prototype.getChannels = function(req, res) {
	res.send(Object.keys(this.analysers));
};

WebAPI.prototype.start = function () {
	this.api.get('/channel', cors(), this.getChannels.bind(this));
	this.api.get('/channel/:channel.json', cors(), this.getChannel.bind(this));

	this.api.listen(this.config.port);

	return this;
};

module.exports = WebAPI;