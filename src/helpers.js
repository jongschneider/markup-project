const { testTagObj } = require('./handlers/config');
const fs = require('fs');

exports.tagCheck = function tagCheck(str, tagObj) {
	// check if tag is present and push array into proper property
	tagObj.map(tag => {
		let regex = new RegExp('<' + tag.name, 'gi');
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
