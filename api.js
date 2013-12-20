
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

function checkChannel(req, res, next) {
	if (!(req.params.channel in this.analysers)) {
		res.status(404).end('Channel does not exist.');
		return;
	}
	req.channel = req.params.channel;
	req.analyser = this.analysers[req.channel];

	next();
}

WebAPI.prototype.registerChannelAPI = function(name, method, params) {
	if (!params) {
		this.api.get('/' + name + '/:channel.json', cors(),
			checkChannel.bind(this), method.bind(this));
	} else {
		this.api.get('/' + name + '/:channel/:' + params.join('/:') + '.json', cors(),
			checkChannel.bind(this), method.bind(this));
	}
};

WebAPI.prototype.getChannel = function (req, res) {
	res.send({ nodes: req.analyser.nodes, edges: req.analyser.edges });
};

WebAPI.prototype.getChannels = function(req, res) {
	res.send(Object.keys(this.analysers));
};

WebAPI.prototype.getList = function(req, res) {
	res.send(req.analyser.getList());
};

WebAPI.prototype.getBFS = function(req, res) {
	if (req.analyser.hasNode(req.params.start)) {
		res.send(req.analyser.bfs(req.params.start));
	} else {
		res.status(400).end('Invalid start node.');
	}
};

WebAPI.prototype.start = function () {
	this.api.get('/channel', cors(), this.getChannels.bind(this));
	this.registerChannelAPI('channel', this.getChannel);
	this.registerChannelAPI('list', this.getList);
	this.registerChannelAPI('bfs', this.getBFS, ['start']);

	this.api.listen(this.config.port);
	return this;
};

module.exports = WebAPI;