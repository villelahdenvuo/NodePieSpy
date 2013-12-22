/**
 * Represents an vertex.
 * @constructor
 * @param {String} label - A label for the vertex.
 */
function Node(label) {
	this.label = label;
	this.weight = 0;
}

/**
 * Convert the vertex to a sring representation.
 * @returns {String} - The vertex in a string form.
 */
Node.prototype.toString = function () {
	return this.label;
};

module.exports = Node;