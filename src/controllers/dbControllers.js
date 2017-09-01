/*jshint esversion: 6 */
const { readdir, readFile } = require('../helpers');
const fs = require('fs');
const { tagCheck, scoreCheck, keyGen, dateFormatter } = require('../helpers');
const { testTagObj } = require('../handlers/config');
const mysql = require('mysql');
const { dbConfig } = require('../handlers/config');

// create mySQL connection
const db = mysql.createConnection(dbConfig);

// connect to db
db.connect(err => {
	if (err) {
		throw err;
	}
	console.log('MySql connected.');
});

//check if html file is in the Database
exports.doesFileExist = (req, res, next) => {
	let filename = req.query.select;
	let key = keyGen(filename);
	let sql = `SELECT html_keys_html_keyname FROM html_parser.html_filenames WHERE html_filename='${req.query.select}';`;
	let query = db.query(sql, (err, result) => {
		if (result.length === 0) {
			let addKey = `INSERT INTO html_parser.html_keys (html_keyname) VALUE('${key}')`;
			db.query(addKey, (err, result) => {
				if (err) throw err;
				let addFile = `INSERT INTO html_parser.html_filenames (html_filename, html_keys_html_keyname) VALUE('${filename}','${key}')`;
				db.query(addFile, (err, result) => {
					if (err) throw err;
				});
			});
			db.query(sql, (err, result) => {
				if (result.length > 0) {
					next();
				}
			});
		}
		next();
	});
};

exports.getFileList = async (req, res, next) => {
	res.locals.fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	next();
};

exports.getKeyList = async (req, res, next) => {
	res.locals.keyList = res.locals.fileList.map(keyGen).filter((v, i, a) => {
		return a.indexOf(v) == i;
	});
	next();
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
	const getScoreColumns =
		'score_runtime, html_filenames_html_filename, score, html_filenames_html_keys_html_keyname';
	const sql1 = `SELECT ${getScoreColumns} FROM scores WHERE html_filenames_html_filename='${req.query.select}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;
	const sql3 = `SELECT ${getScoreColumns} FROM scores ORDER BY html_filenames_html_keys_html_keyname ASC;`;
	const sqlTotalAvg =
		'SELECT html_filenames_html_filename, AVG(score) FROM html_parser.scores GROUP BY html_filenames_html_filename;';
	const sqlAvg = `SELECT html_filenames_html_filename, AVG(score) FROM html_parser.scores WHERE html_filenames_html_filename='${req.query.select}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;
	if (req.query.select === 'All Scores') {
		const scoreData = db.query(sql3, (err, result) => {
			if (err) throw err;
			db.query(sqlTotalAvg, (err, avg) => {
				if (err) throw err;
				res.render('search_results_by_file', {
					data: res.locals.fileList,
					results: result,
					title: req.query.select,
					avgs: avg,
					keyList: res.locals.keyList
				});
			});
		});
	}
	const scoreData = db.query(sql1, (err, result) => {
		if (err) throw err;
		db.query(sqlAvg, (err, avg) => {
			if (err) throw err;
			res.render('search_results_by_file', {
				data: res.locals.fileList,
				results: result,
				title: req.query.select,
				avgs: avg,
				keyList: res.locals.keyList
			});
		});
	});
};

exports.getScoresByKey = (req, res, next) => {
	const getScoreColumns =
		'score_runtime, html_filenames_html_filename, score, html_filenames_html_keys_html_keyname';
	const sql1 = `SELECT ${getScoreColumns} FROM scores WHERE html_filenames_html_keys_html_keyname='${req.query.select}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;
	const sql3 = `SELECT ${getScoreColumns} FROM scores ORDER BY html_filenames_html_keys_html_keyname ASC;`;
	const sqlAvg = `SELECT html_filenames_html_keys_html_keyname, AVG(score) FROM html_parser.scores WHERE html_filenames_html_keys_html_keyname='${req.query.select}';`;
	const sqlTotalAvg =
		'SELECT html_filenames_html_keys_html_keyname, AVG(score) FROM html_parser.scores GROUP BY html_filenames_html_keys_html_keyname;';
	if (req.query.select === 'All Scores') {
		const scoreData = db.query(sql3, (err, result) => {
			if (err) throw err;
			db.query(sqlTotalAvg, (err, avg) => {
				if (err) throw err;
				res.render('search_results_by_key', {
					data: res.locals.fileList,
					results: result,
					title: req.query.select,
					avgs: avg,
					keyList: res.locals.keyList
				});
			});
		});
	}
	const scoreData = db.query(sql1, (err, result) => {
		if (err) throw err;
		db.query(sqlAvg, (err, avg) => {
			if (err) throw err;
			res.render('search_results_by_key', {
				data: res.locals.fileList,
				results: result,
				title: req.query.select,
				avgs: avg,
				keyList: res.locals.keyList
			});
		});
	});
};

exports.showHtml = async (req, res, next) => {
	const html = await readFile(`../data/${req.query.select}`);
	res.render('index', {
		data: res.locals.fileList,
		html,
		fileName: req.query.select,
		score: res.locals.score
	});
};

exports.scoreAndUpdate = (req, res, next) => {
	const ms = fs.createReadStream(`../data/${req.query.select}`, 'utf8');
	ms.on('data', chunk => {
		let scoreObj = tagCheck(chunk, testTagObj());
		let score = scoreCheck(scoreObj);
		res.locals.score = score;
		let filename = req.query.select;
		let key = keyGen(filename);
		let dataObj = {
			score,
			html_filenames_html_filename: filename,
			html_filenames_html_keys_html_keyname: key
		};
		let sql = 'INSERT INTO scores SET ?';
		let query = db.query(sql, dataObj, (err, result) => {
			if (err) throw err;
			next();
		});
	});
};

exports.getMax = (req, res, next) => {
	const max =
		'SELECT html_filenames_html_filename, score_runtime, html_filenames_html_keys_html_keyname, score FROM html_parser.scores WHERE score=(SELECT MAX(score) FROM html_parser.scores) ORDER BY score_runtime DESC;';
	db.query(max, (err, result) => {
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
	const min =
		'SELECT html_filenames_html_filename, score_runtime, html_filenames_html_keys_html_keyname, score FROM html_parser.scores WHERE score=(SELECT MIN(score) FROM html_parser.scores) ORDER BY score_runtime DESC;';
	db.query(min, (err, result) => {
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
	const rangeSql = `SELECT * FROM html_parser.scores WHERE score_runtime>='${date1}' && score_runtime<='${date2}';`;
	db.query(rangeSql, (err, result) => {
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
