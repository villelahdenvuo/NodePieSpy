/** Analyser Test
 * @module AnalyserTest
 * @requires Analyser
 */

/** Test that the Analyser contructor works. */
exports.analyserConstructorWorks = function (test) {
	var Analyser = require('../lib/analyser');

	test.doesNotThrow(function () {
		var analyser = new Analyser();
	});
	test.done();
};