/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const dbControllers = require('../controllers/dbControllers');

// homepage get list of files in data folder
router.get('/', catchErrors(dbControllers.homePage));

// homepage displays html from file scored
router.get(
	'/scoreFile',
	dbControllers.doesFileExist,
	dbControllers.scoreAndUpdate,
	catchErrors(dbControllers.showHtml)
);

// homepage get html from a file
router.get('/getHtml', async (req, res, next) => {
	const fileList = await readdir('../data/').then(files =>
		files.filter(file => file.match(/.html/gi))
	);
	const html = await readFile(`../data/${req.query.select}`);
	res.render('index', {
		data: fileList,
		html,
		fileName: req.query.select
	});
});

// searchpage get list of files in data folder
router.get('/search', catchErrors(dbControllers.searchPage));

//test get route
router.get('/getscores', dbControllers.getscores);

module.exports = router;
