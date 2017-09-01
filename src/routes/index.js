/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const dbControllers = require('../controllers/dbControllers');

// homepage get list of files in data folder
router.get('/', catchErrors(dbControllers.getFileList), dbControllers.homePage);

// homepage displays html from file scored
router.get(
	'/scoreFile',
	dbControllers.doesFileExist,
	dbControllers.scoreAndUpdate,
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.showHtml)
);

// searchpage get list of files in data folder
router.get(
	'/search',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.searchPage
);

// query db for data by filename
router.get(
	'/getScoresByFile',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.getScoresByFile
);

// query db for data by key
router.get(
	'/getScoresByKey',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.getScoresByKey
);

// query db for data by key
router.get(
	'/max',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.getMax
);

// query db for data by key
router.get(
	'/min',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.getMin
);

// query db for data by date range
router.get(
	'/dateRange',
	catchErrors(dbControllers.getFileList),
	catchErrors(dbControllers.getKeyList),
	dbControllers.dateRange
);

module.exports = router;
