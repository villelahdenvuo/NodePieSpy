/** @module cluster */

var toMatrix = require('./to-matrix')
	, Graph = require('../data-structures/graph');

/**
 * Cluster a graph using the Markov Cluster Algorithm.
 * @param {Graph} graph - The graph
 * @param {Number} inflation - Controls the granularity of the clusters
 * @returns {Array} - A matrix of clusters
 */
module.exports = function cluster(graph, inflation) {
	var currentMat = toMatrix(graph), lastMat = [];

	normalize(currentMat);

	currentMat = expand(currentMat);
	inflate(currentMat, inflation);
	normalize(currentMat);

	var iterations = 0;
	while(!equals(currentMat, lastMat)) {
		lastMat = currentMat.slice(0);

		currentMat = expand(currentMat);
		inflate(currentMat, inflation);
		normalize(currentMat);

		if (++iterations > 100) { console.log('timeout'); }
	}

	console.log('Convergence in', iterations, 'iterations.');

	return currentMat;
};

/**
 * Round a number to 3 digits.
 * @param {Number} n - The number to round
 * @returns {Number} - The rounded number
 */
function round(n) {
	return Math.round(n * 100) / 100;
}

/**
 * Normalize matrix. Calculate the sums of the columns and
 * divide each value with the sum of it's column.
 * @param {Object} matrix - The matrix to normalize
 */
function normalize(matrix) {
	var sums = [], i, j;
	for (i = matrix.length - 1; i >= 0; i--) {
		var sum = 0;
		for (j = matrix.length - 1; j >= 0; j--) {
			sum += matrix[j][i];
		}
		sums[i] = sum;
	}

	for (i = matrix.length - 1; i >= 0; i--) {
		for (j = matrix.length - 1; j >= 0; j--) {
			matrix[j][i] = round(matrix[j][i] / sums[i]);
		}
	}
}

/**
 * Expand matrix. 
 * @param {Object} matrix - The matrix to expand
 * @returns {Object} - The expanded matrix
 */
function expand(matrix) {
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

/**
 * Inflate matrix. This adds contrast between strong and weak edges.
 * @param {Object} matrix - The matrix to expand
 * @param {Number} pow - The power of inflation.
 */
function inflate(matrix, pow) {
	for (var i = matrix.length - 1; i >= 0; i--) {
		for (var j = matrix.length - 1; j >= 0; j--) {
			matrix[i][j] = Math.pow(matrix[i][j], pow);
		}
	}
}

/**
 * Checks if two matrices are the same.
 * @param {Object} a - The first matrix
 * @param {Object} b - The second matrix
 * @param {Number} precision - How accurate to be
 * @returns {Boolean} - Equal or not
 */
function equals(a, b, precision) {
	precision = precision || 0.1;
	if (!b.length) { return false; }
	for (var i = a.length - 1; i >= 0; i--) {
		for (var j = a[i].length - 1; j >= 0; j--) {
			if (Math.abs(a[i][j] - b[i][j]) > precision) {
				return false;
			}
		}
	}
	return true;
}