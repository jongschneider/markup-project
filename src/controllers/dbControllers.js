/*jshint esversion: 6 */
const { readdir, readFile } = require('../helpers');
const fs = require('fs');
const { tagCheck, scoreCheck, keyGen, dateFormatter } = require('../helpers');
const { testTagObj } = require('../handlers/config');
const mysql = require('mysql');
const { dbConfig } = require('../handlers/config');
const db_queries = require('../handlers/db_queries');
const promisify = require('es6-promisify');

// create mySQL connection
const db = mysql.createConnection(dbConfig);

// connect to db
db.connect(err => {
	if (err) {
		throw err;
	}
	console.log('MySql connected.');
});

// Make the following mySql db functions promise aware.
const dbQuery = promisify(db.query);

//check if html file is in the Database
// exports.doesFileExist = (req, res, next) => {
// 	let filename = req.query.select;
// 	res.locals.filename = filename;
// 	let key = keyGen(filename);
// 	db.query(db_queries.checkIfFileExists(filename), (err, result) => {
// 		if (result.length === 0) {
// 			db.query(db_queries.addKey(key), (err, result) => {
// 				if (err) throw err;
// 				db.query(db_queries.addFile(filename, key), (err, result) => {
// 					if (err) throw err;
// 				});
// 			});
// 			db.query(db_queries.checkIfFileExists(filename), (err, result) => {
// 				if (result.length > 0) {
// 					return next();
// 				}
// 			});
// 		}
// 		return next();
// 	});
// };
exports.doesFileExist = async (req, res, next) => {
	let filename = req.query.select;
	res.locals.filename = filename;
	let key = keyGen(filename);
	const doesExist = await dbQuery(db_queries.checkIfFileExists(filename));
	console.log('doesExist: ', doesExist);
	doesExist.then(async function(x) {
		console.log('x: ', x);
		if (x.length <= 0) {
			await dbQuery(db_queries.addKey(key));
			await dbQuery(db_queries.addFile(filename, key));
		}
	});
};

exports.scoreAndUpdate = (req, res, next) => {
	const ms = fs.createReadStream(`../data/${res.locals.filename}`, 'utf8');
	ms.on('data', chunk => {
		let scoreObj = tagCheck(chunk, testTagObj());
		let score = scoreCheck(scoreObj);
		res.locals.score = score;
		let key = keyGen(res.locals.filename);
		let dataObj = {
			score,
			html_filenames_html_filename: res.locals.filename,
			html_filenames_html_keys_html_keyname: key
		};
		let query = db.query(db_queries.insertPre, dataObj, (err, result) => {
			if (err) throw err;
			return next();
		});
	});
};

exports.showHtml = async (req, res, next) => {
	const html = await readFile(`../data/${res.locals.filename}`);
	res.render('index', {
		data: res.locals.fileList,
		html,
		fileName: res.locals.filename,
		score: res.locals.score
	});
};

// retrieve list of files from data directory and filter out all filetypes other than .html
exports.getFileList = async (req, res, next) => {
	res.locals.fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	return next();
};

// create key from files list and filter out duplicates
exports.getKeyList = async (req, res, next) => {
	res.locals.keyList = res.locals.fileList.map(keyGen).filter((v, i, a) => {
		return a.indexOf(v) == i;
	});
	return next();
};

exports.homePage = (req, res, next) => {
	res.render('index', { data: res.locals.fileList });
};

exports.searchPage = (req, res, next) => {
	res.render('search', {
		data: res.locals.fileList,
		keyList: res.locals.keyList
	});
};

exports.getScoresByFile = (req, res, next) => {
	const filename = req.query.select;
	if (req.query.select === 'All Scores') {
		db.query(db_queries.getAllScores, (err, result) => {
			if (err) throw err;
			db.query(db_queries.getAllScoresAvgByFilename, (err, avg) => {
				if (err) throw err;
				res.render('search_results_by_file', {
					data: res.locals.fileList,
					results: result,
					title: filename,
					avgs: avg,
					keyList: res.locals.keyList
				});
			});
		});
	} else {
		const scoreData = db.query(
			db_queries.getScoresByFilename(filename),
			(err, result) => {
				if (err) throw err;
				db.query(db_queries.getScoresByFilenameAvg(filename), (err, avg) => {
					if (err) throw err;
					res.render('search_results_by_file', {
						data: res.locals.fileList,
						results: result,
						title: filename,
						avgs: avg,
						keyList: res.locals.keyList
					});
				});
			}
		);
	}
};

exports.getScoresByKey = (req, res, next) => {
	const filename = req.query.select;
	if (filename === 'All Scores') {
		db.query(db_queries.getAllScores, (err, result) => {
			if (err) throw err;
			db.query(db_queries.sqlTotalAvgByKey, (err, avg) => {
				if (err) throw err;
				res.render('search_results_by_key', {
					data: res.locals.fileList,
					results: result,
					title: filename,
					avgs: avg,
					keyList: res.locals.keyList
				});
			});
		});
	} else {
		db.query(db_queries.getScoresByKeyname(filename), (err, result) => {
			if (err) throw err;
			db.query(db_queries.sqlAvgByKey(filename), (err, avg) => {
				if (err) throw err;
				res.render('search_results_by_key', {
					data: res.locals.fileList,
					results: result,
					title: filename,
					avgs: avg,
					keyList: res.locals.keyList
				});
			});
		});
	}
};

exports.getMax = (req, res, next) => {
	db.query(db_queries.max, (err, result) => {
		if (err) throw err;
		res.render('max', {
			data: res.locals.fileList,
			title: 'Max',
			max: result,
			keyList: res.locals.keyList
		});
	});
};

exports.getMin = (req, res, next) => {
	db.query(db_queries.min, (err, result) => {
		if (err) throw err;
		res.render('min', {
			data: res.locals.fileList,
			title: 'Min',
			min: result,
			keyList: res.locals.keyList
		});
	});
};

exports.dateRange = (req, res, next) => {
	const [date1, date2] = dateFormatter(req.query.daterange);
	db.query(db_queries.rangeSql(date1, date2), (err, result) => {
		if (err) throw err;
		res.render('dateRange', {
			data: res.locals.fileList,
			title: 'Date Ranges',
			ranges: result,
			keyList: res.locals.keyList,
			dates: {
				date1,
				date2
			}
		});
	});
};
