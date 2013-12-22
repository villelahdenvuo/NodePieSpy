/** @module parser */

var messageRegEx = /(\d\d):(\d\d) <.(.*?)> (.*)/
	, moment = require('moment');

/**
 * Parse a single IRC log line.
 * @param {String} msg - The line
 * @returns {Object} - The parsed data chunk
 */
module.exports = function LogParser(msg) {
	var result = messageRegEx.exec(msg);

	if (result && result[4]) {
		var time = moment();
		time.hour(parseInt(result[1], 10));
		time.minute(parseInt(result[2], 10));
		time.second(0);
		return {
			/*"time": time,*/
			"nick": result[3].trim(),
			"msg": result[4]
		};
	}
	return false;
};