
function Node(nick) {
	this.label = nick;
	this.weight = 0;
}

Node.prototype.toString = function () {
	return this.label;
};

module.exports = Node;