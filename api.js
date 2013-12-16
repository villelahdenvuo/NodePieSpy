
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

WebAPI.prototype.rest = function (req, res) {
	var channel = req.params.channel;

	if (!(channel in this.analysers)) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Resource not found.');
		return;
	}

	var analyser = this.analysers[channel];

	//res.writeHead(200, {'Content-Type': 'text/plain'});
	res.send({
		nodes: analyser.nodes,
		edges: analyser.edges
	});

};

WebAPI.prototype.start = function () {
	this.api.listen(this.config.port);

	this.api.get('/:channel.json', cors(), this.rest.bind(this));
};

module.exports = WebAPI;