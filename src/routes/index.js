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
		console.log(result);
		res.end(JSON.stringify(result));
	});
});

// router.get('/getHtml/:file', async (req, res, next) => {
// const fileList = await readdir('../data/').then(files =>
// 	files.filter(file => file.match(/.html/gi))
// );
// 	const createReadStream = promisify(fs.createReadStream);
// 	const data = await createReadStream(`../data/${req.params.file}`);
// 	const html = '';
// 	await data.on('data', chunk => html += chunk);
// 	res.render('index', { data: fileList, html });
// });

//homepage get html from a file
router.get('/getHtml', async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);

	fs.readFile(`../data/bob_2013_03_01.html`, 'utf8', (err, result) => {
		console.log(result);
		res.render('index', { data: fileList, html: result });
	});
});

module.exports = router;
