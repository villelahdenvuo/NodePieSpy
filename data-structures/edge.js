function Edge(source, target) {
	this.source = source;
	this.target = target;
	this.weight = 0;
}

Edge.prototype.toString = function () {
	console.log(this);
	return hashCode(this.source) + hashCode(this.target);
};


function hashCode(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

module.exports = Edge;