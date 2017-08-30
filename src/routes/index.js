/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const mysql = require('mysql');
const { dbConfig } = require('../handlers/config');
const { catchErrors } = require('../handlers/errorHandlers');

// create mySQL connection
const db = mysql.createConnection(dbConfig);

// connect to db
db.connect(err => {
	if (err) {
		throw err;
	}
	console.log('MySql connected.');
});

//homepage
router.get('/', (req, res, next) => {
	fs.readFile('../data/john_2013_03_13.html', 'utf8', (err, result) => {
		res.render('index', { data: result });
	});
});

//
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
