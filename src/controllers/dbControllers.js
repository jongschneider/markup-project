/*jshint esversion: 6 */
const { readdir, readFile } = require('../helpers');
const fs = require('fs');
const { tagCheck, scoreCheck, keyGen } = require('../helpers');
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

exports.homePage = async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	res.render('index', { data: fileList });
};

exports.searchPage = async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	res.render('search', { data: fileList });
};

exports.getscores = async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	const getScoreColumns =
		'score_runtime, html_filenames_html_filename, score, html_filenames_html_keys_html_keyname';
	const sql1 = `SELECT ${getScoreColumns} FROM scores WHERE html_filenames_html_filename='${req.query.select}';`;
	const sql2 = `SELECT AVG(score) AS avg FROM html_parser.scores WHERE html_filenames_html_filename='${req.query.select}'`;
	const scoreData = db.query(sql1, (err, result) => {
		if (err) throw err;
		console.log(result);
		db.query(sql2, (err, avg) => {
			if (err) throw err;
			console.log(avg);
			res.render('search_results', {
				data: fileList,
				results: result,
				title: req.query.select,
				avg: avg
			});
		});

		// res.end(JSON.stringify(result));
	});
};

exports.showHtml = async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	const html = await readFile(`../data/${req.query.select}`);
	res.render('index', {
		data: fileList,
		html,
		fileName: req.query.select
	});
};

exports.scoreAndUpdate = (req, res, next) => {
	const ms = fs.createReadStream(`../data/${req.query.select}`, 'utf8');
	ms.on('data', chunk => {
		let scoreObj = tagCheck(chunk, testTagObj());
		let score = scoreCheck(scoreObj);
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
