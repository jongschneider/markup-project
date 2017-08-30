/*jshint esversion: 6 */

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

const { dbConfig } = require('./handlers/config');

const app = express();
const port = process.env.PORT || 7777;

// create mySQL connection
const db = mysql.createConnection(dbConfig);

// connect to db
db.connect(err => {
	if (err) {
		throw err;
	}
	console.log('MySql connected.');
});

// test route to set up mysql db
// app.get('/createdb', (req, res, next) => {
// 	let sql = 'CREATE DATABASE tagmysql';
// 	db.query(sql, (err, result) => {
// 		if (err) throw err;
// 		res.send('Database created...');
// 	});
// });

// create table
// app.get('/createpoststable', (req, res, next) => {
// 	let sql =
// 		'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
// 	db.query(sql, (err, result) => {
// 		if (err) throw err;
// 		console.log(result);
// 		res.send('Posts table created...');
// 	});
// });

//add file score to
app.get('/insert', (req, res, next) => {
	let filename = 'cari_2013_03_05.html';
	let key = filename.slice(0, filename.indexOf('_'));
	let score = {
		score: '15',
		html_filenames_html_filename: filename,
		html_filenames_html_keys_html_keyname: key
	};
	let sql = 'INSERT INTO scores SET ?';
	let query = db.query(sql, score, (err, result) => {
		if (err) throw err;
		console.log(result);
		res.send('Score inserted to table...');
	});
});

//add post to poststable
// app.get('/insertpost2', (req, res, next) => {
// 	let post = {
// 		title: 'Post Two',
// 		body: 'Postimus twoimus.'
// 	};
// 	let sql = 'INSERT INTO posts SET ?';
// 	let query = db.query(sql, post, (err, result) => {
// 		if (err) throw err;
// 		console.log(result);
// 		res.send('Post2 inserted to table...');
// 	});
// });

// select posts from db
// app.get('/getposts', (req, res, next) => {
// 	let sql = 'SELECT * FROM posts';
// 	let query = db.query(sql, (err, result) => {
// 		if (err) throw err;
// 		console.log(result);
// 		res.end(JSON.stringify(result));
// 	});
// });

// select score data from db
app.get('/getscore', (req, res, next) => {
	let sql =
		'SELECT * FROM scores WHERE html_filenames_html_keys_html_keyname="bob"';
	let query = db.query(sql, (err, result) => {
		if (err) throw err;
		console.log(result);
		res.end(JSON.stringify(result));
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
	/* Development Error Handler - Prints stack trace */
	app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
