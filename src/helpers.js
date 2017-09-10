const { testTagObj } = require('./handlers/config');
const fs = require('fs');
const promisify = require('es6-promisify');

// makes fs.readdir promise aware
exports.readdir = promisify(fs.readdir);

// makes fs.readfile promise aware
exports.readFile = promisify(fs.readFile);

exports.tagCheck = function tagCheck(str, tagObj) {
	// check if tag is present and push array into proper property
	tagObj.map(tag => {
		let regex = new RegExp(`<${tag.name}`, 'gi');
		if (str.match(regex)) {
			tag.count = str.match(regex).length;
			tag.tagScore = tag.count * tag.scoreModifier;
		}
	});
	return tagObj;
};

exports.scoreCheck = function scoreCheck(objArray) {
	return objArray.reduce((acc, v) => {
		return acc + v.tagScore;
	}, 0);
};

exports.keyGen = function(filename) {
	return filename.slice(0, filename.indexOf('_'));
};

function splitter(str) {
	return str.split('-');
}

function formatDates(dateArray) {
	return dateArray.map(x => x.trim()).map(x => x.replace(/\//gi, '-'));
}

function flipper(arr) {
	return arr.map(el => el.split('-'));
}

function reorient(arr) {
	return arr.map(y => {
		let [a, b, c] = y;
		return [c, a, b];
	});
}

function joiner(arr) {
	return arr.map(s => s.join('-'));
}

exports.dateFormatter = str =>
	joiner(reorient(flipper(formatDates(splitter(str)))));
