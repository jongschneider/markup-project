/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const dbControllers = require('../controllers/dbControllers');

// homepage get list of files in data folder
router.get('/', catchErrors(dbControllers.getFileList), dbControllers.homePage);

// homepage displays html from file scored
router.post(
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
	dbControllers.getKeyList,
	dbControllers.searchPage
);

// query db for data by filename
router.get(
	'/getScoresByFile',
	catchErrors(dbControllers.getFileList),
	dbControllers.getKeyList,
	dbControllers.getScoresByFile
);

// query db for data by key
router.get(
	'/getScoresByKey',
	catchErrors(dbControllers.getFileList),
	dbControllers.getKeyList,
	dbControllers.getScoresByKey
);

// query db for max
router.get(
	'/max',
	catchErrors(dbControllers.getFileList),
	dbControllers.getKeyList,
	dbControllers.getMax
);

// query db for min
router.get(
	'/min',
	catchErrors(dbControllers.getFileList),
	dbControllers.getKeyList,
	dbControllers.getMin
);

// query db for data by date range
router.get(
	'/dateRange',
	catchErrors(dbControllers.getFileList),
	dbControllers.getKeyList,
	dbControllers.dateRange
);

module.exports = router;
