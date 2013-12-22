/**
 * Represents an edge.
 * @constructor
 * @param {Node} source - Source vertex
 * @param {Node} target - Target vertex
 */
function Edge(source, target) {
	this.source = source;
	this.target = target;
	this.weight = 0;
}

/**
 * Convert the edge to a sring representation.
 * @returns {String} - Hashcode in a string form.
 */
Edge.prototype.toString = function () {
	function hashCode(s) {
		return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
	}
	return "" + (hashCode(this.source) + hashCode(this.target));
};

module.exports = Edge;