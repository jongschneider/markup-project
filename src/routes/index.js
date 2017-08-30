/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const mysql = require('mysql');
const { dbConfig } = require('../handlers/config');
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

//homepage get html from a file
// router.get('/', (req, res, next) => {
// 	fs.readFile('../data/john_2013_03_13.html', 'utf8', (err, result) => {
// 		res.render('index', { data: result });
// 	});
// });

// homepage get list of files in data folder
router.get('/', async (req, res, next) => {
	const readdir = promisify(fs.readdir);
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	console.log(fileList);
	res.render('index', { data: fileList });
});

router.get('/getscore', (req, res, next) => {
	let sql =
		'SELECT * FROM scores WHERE html_filenames_html_keys_html_keyname="bob"';
	let query = db.query(sql, (err, result) => {
		if (err) throw err;
		console.log(result);
		res.end(JSON.stringify(result));
	});
});

module.exports = router;
