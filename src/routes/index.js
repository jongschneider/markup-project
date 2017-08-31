/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const mysql = require('mysql');
const { dbConfig } = require('../handlers/config');
const { testTagObj } = require('../handlers/config');
const { tagCheck, scoreCheck, keyGen } = require('../helpers');
const { catchErrors } = require('../handlers/errorHandlers');
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

// homepage get list of files in data folder
const readdir = promisify(fs.readdir);

router.get('/', async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	res.render('index', { data: fileList });
});

router.get('/getscore', (req, res, next) => {
	let sql =
		'SELECT * FROM scores WHERE html_filenames_html_keys_html_keyname="bob"';
	let query = db.query(sql, (err, result) => {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

// homepage get html from a file
router.get('/getHtml', async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	fs.readFile(`../data/${req.query.select}`, 'utf8', (err, result) => {
		res.render('index', {
			data: fileList,
			html: result,
			fileName: req.query.select
		});
	});
});

// homepage get html from a file
router.get('/scoreFile', (req, res, next) => {
	const ms = fs.createReadStream(`../data/${req.query.select}`, 'utf8');
	ms.on('data', chunk => {
		let scoreObj = tagCheck(chunk, testTagObj);
		let score = scoreCheck(scoreObj);
		let filename = req.query.select;
		let key = keyGen(filename);
		let dataObj = {
			score,
			html_filenames_html_filename: filename,
			html_filenames_html_keys_html_keyname: 'john'
		};
		let sql = 'INSERT INTO scores SET ?';
		let query = db.query(sql, dataObj, (err, result) => {
			if (err) throw err;
			console.log(result);
			res.send('Score inserted to table...');
		});
	});
});

module.exports = router;
