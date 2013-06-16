
var http = require('http')
	, url = require('url');

function WebAPI(analysers, config) {
	this.analysers = analysers;
	this.api = http.createServer(this.rest.bind(this));
	this.config = config;
}

WebAPI.prototype.rest = function (req, res) {
	var path = req.url.split(/\/|\./);
	//console.log(path);
	if (!this.analysers[path[1]]) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Resource not found.');
		return;
	}

	if (path[2] !== 'json') {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end('Bad request.');
		return;
	}

	var analyser = this.analysers[path[1]];

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(JSON.stringify({
		nodes: analyser.nodes,
		edges: analyser.edges
	}));

};

WebAPI.prototype.start = function () {
	this.api.listen(this.config.port);
};

module.exports = WebAPI;