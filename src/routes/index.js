/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
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

//homepage
router.get('/', (req, res, next) => {
	res.render('index');
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
