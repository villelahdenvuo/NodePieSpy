var split = require('split')
	, Analyser = require('../lib/analyser')
	, parse = require('../lib/parser')
	, api = require('../lib/api')
	, cluster = require('cluster')
	, fs = require('fs');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < 5; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {

	var analyser = new Analyser();
	analyser.addHeuristic('adjacency');

	fs.createReadStream(__dirname + '/example.log').pipe(split()).on('data', processChunk.bind(analyser));

	function processChunk(chunk) {
		var data = parse(chunk);
		if (data) {
			this.infer(data);
		}
	}

	var web = new api({example: analyser}, {port: 8080}).start();
}