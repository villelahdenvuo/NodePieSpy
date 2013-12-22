var express = require('express')
	, cors = require('cors');

/**
 * WebAPI creates a new HTTP server that handles API requests.
 * @constructor
 * @param {Object} analysers - Named analysers to serve
 * @param {Object} config - Configuration object
 */
function WebAPI(analysers, config) {
	this.analysers = analysers;
	var app = this.api = express();
	this.config = config;

	app.configure(function () {
		app.use(express.compress());
	});
}

/**
 * Check that channel parameter is correct and populate request object with channel and analyser.
 * @private
 */
WebAPI.prototype.checkChannel = function (req, res, next) {
	if (!(req.params.channel in this.analysers)) {
		res.status(404).end('Channel does not exist.');
		return;
	}
	req.channel = req.params.channel;
	req.analyser = this.analysers[req.channel];

	next();
};

/**
 * Register an Channel API.
 * @private
 * @param {String} name - Name of the api
 * @param {Function} method - Function to call
 * @param {String[]} [params] - Optional parameters
 */
WebAPI.prototype.registerChannelAPI = function (name, method, params) {
	if (!params) {
		this.api.get('/' + name + '/:channel.json', cors(),
			this.checkChannel.bind(this), method.bind(this));
	} else {
		this.api.get('/' + name + '/:channel/:' + params.join('/:') + '.json', cors(),
			this.checkChannel.bind(this), method.bind(this));
	}
};

/**
 * Serves graph for a channel.
 * @private
 */
WebAPI.prototype.getChannel = function (req, res) {
	res.send({ nodes: req.analyser.nodes, edges: req.analyser.edges });
};

/**
 * Serves a list of available channels.
 * @private
 */
WebAPI.prototype.getChannels = function (req, res) {
	res.send(Object.keys(this.analysers));
};

/**
 * Serves graph for a channel as an adjacency list.
 * @private
 */
WebAPI.prototype.getList = function (req, res) {
	res.send(req.analyser.getList());
};

/**
 * Serves a BFS tree for a channel.
 * @private
 */
WebAPI.prototype.getBFS = function (req, res) {
	if (req.analyser.hasNode(req.params.start)) {
		res.send(req.analyser.bfs(req.params.start));
	} else {
		res.status(400).end('Invalid start node.');
	}
};

/**
 * Start listening for requests.
 */
WebAPI.prototype.start = function () {
	this.api.get('/channel', cors(), this.getChannels.bind(this));

	this.registerChannelAPI('channel', this.getChannel);
	this.registerChannelAPI('list', this.getList);
	this.registerChannelAPI('bfs', this.getBFS, ['start']);

	this.api.listen(this.config.port);
	return this;
};

module.exports = WebAPI;