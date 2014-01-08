/** @module cluster */

var toMatrix = require('./to-matrix')
	, Graph = require('../data-structures/graph');

/**
 * Cluster a graph.
 * @param {Graph} graph - The graph
 * @returns {Array} - A matrix of clusters
 */
module.exports = function cluster(graph, power, inflation) {
	var lastMat = []
		, currentMat = toMatrix(graph);

	normalize(currentMat);

	currentMat = expand(currentMat, power);
	inflate(currentMat, inflation);
	normalize(currentMat);

	var c = 0;
	while(!equals(currentMat, lastMat)) {
		lastMat = currentMat.slice(0);

		currentMat = expand(currentMat, power);
		inflate(currentMat, inflation);
		normalize(currentMat);

		if (++c > 700) { break; }
	}

	return currentMat;
};

function round(n) {
	return Math.round(n * 100) / 100;
}

function normalize(matrix) {
	var sums = [];
	for (var i = matrix.length - 1; i >= 0; i--) {
		var sum = 0;
		for (var j = matrix.length - 1; j >= 0; j--) {
			sum += matrix[j][i];
		}
		sums[i] = sum;
	}

	for (var i = matrix.length - 1; i >= 0; i--) {
		for (var j = matrix.length - 1; j >= 0; j--) {
			matrix[j][i] = round(matrix[j][i] / sums[i]);
		}
	}
}

function expand(matrix, pow) {
	var result = [];
	for (var i = matrix.length - 1; i >= 0; i--) {
		result[i] = []; 
		for (var j = matrix.length - 1; j >= 0; j--) {
			var res = 0;
			for (var c = matrix.length - 1; c >= 0; c--) {
				res += matrix[i][c] * matrix[c][j];
			}
			result[i][j] = res;
		}
	}
	return result;
}

function inflate(matrix, pow) {
	for (var i = matrix.length - 1; i >= 0; i--) {
		for (var j = matrix.length - 1; j >= 0; j--) {
			matrix[i][j] = Math.pow(matrix[i][j], pow);
		}
	}
}

function equals(a, b) {
	for (var i = a.length - 1; i >= 0; i--) {
		for (var j = a[i].length - 1; j >= 0; j--) {
			if(!b[i] || !b[i][j] || a[i][j] - b[i][j] > 0.1) {
				return false;
			}
		}
	}
	return true;
}