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
		app.set('json spaces', 0);
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
	res.json({ nodes: req.analyser.graph.nodes, edges: req.analyser.graph.edges });
};

/**
 * Serves a list of available channels.
 * @private
 */
WebAPI.prototype.getChannels = function (req, res) {
	res.json(Object.keys(this.analysers));
};

/**
 * Serves graph for a channel as an adjacency list.
 * @private
 */
WebAPI.prototype.getList = function (req, res) {
	res.json(req.analyser.getList());
};

/**
 * Serves graph for a channel as an adjacency matrix.
 * @private
 */
WebAPI.prototype.getMatrix = function (req, res) {
	res.json(req.analyser.getMatrix());
};

/**
 * Serves a BFS tree for a channel.
 * @private
 */
WebAPI.prototype.getBFS = function (req, res) {
	if (req.analyser.graph.hasNode(req.params.start)) {
		res.json(req.analyser.bfs(req.params.start));
	} else {
		res.status(400).end('Invalid start node.');
	}
};

/**
 * Serves a matrix of clusters.
 * @private
 */
WebAPI.prototype.getClusters = function (req, res) {
	console.log(req.params.inflation);
	var	graph = req.analyser.getClusters(req.params.inflation);
	res.json({ nodes: graph.nodes, edges: graph.edges });
	req.analyser.graph.resetClusterGroups();
};

/**
 * Start listening for requests.
 */
WebAPI.prototype.start = function () {
	this.api.get('/graph', cors(), this.getChannels.bind(this));

	this.registerChannelAPI('graph', this.getChannel);
	this.registerChannelAPI('list', this.getList);
	this.registerChannelAPI('matrix', this.getMatrix);
	this.registerChannelAPI('bfs', this.getBFS, ['start']);
	this.registerChannelAPI('clusters', this.getClusters, ['inflation']);

	this.api.listen(this.config.port);
	return this;
};

module.exports = WebAPI;