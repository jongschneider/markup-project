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

exports.homePage = async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	res.render('index', { data: fileList });
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
		let scoreObj = tagCheck(chunk, testTagObj);
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
			console.log(result);
			next();
			// res.send('Score inserted to table...');
		});
	});
};
