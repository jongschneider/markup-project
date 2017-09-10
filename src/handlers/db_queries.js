/*jshint esversion: 6 */

// scoreFile route db queries
exports.checkIfFileExists = filename =>
	`SELECT html_keys_html_keyname FROM html_parser.html_filenames WHERE html_filename='${filename}';`;

exports.checkIfKeyExists = keyname =>
	`SELECT html_keys_html_keyname FROM html_parser.html_filenames WHERE html_keys_html_keyname='${keyname}';`;

exports.addKey = key =>
	`INSERT INTO html_parser.html_keys (html_keyname) VALUE('${key}')`;

exports.addFile = (filename, key) =>
	`INSERT INTO html_parser.html_filenames (html_filename, html_keys_html_keyname) VALUE('${filename}','${key}')`;

const getScoreColumns =
	'score_runtime, html_filenames_html_filename, score, html_filenames_html_keys_html_keyname';

exports.insertPre = 'INSERT INTO scores SET ?';

// getScoresByFile route db queries
exports.getScoresByFilename = filename =>
	`SELECT ${getScoreColumns} FROM scores WHERE html_filenames_html_filename='${filename}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;

exports.getAllScores = `SELECT ${getScoreColumns} FROM scores ORDER BY html_filenames_html_keys_html_keyname ASC;`;

exports.getAllScoresAvgByFilename =
	'SELECT html_filenames_html_filename, AVG(score) FROM html_parser.scores GROUP BY html_filenames_html_filename;';

exports.getScoresByFilenameAvg = filename =>
	`SELECT html_filenames_html_filename, AVG(score) FROM html_parser.scores WHERE html_filenames_html_filename='${filename}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;

// getScoresByKey route db queries
exports.getScoresByKeyname = keyname =>
	`SELECT ${getScoreColumns} FROM scores WHERE html_filenames_html_keys_html_keyname='${keyname}' ORDER BY html_filenames_html_keys_html_keyname ASC;`;

exports.sqlAvgByKey = key =>
	`SELECT html_filenames_html_keys_html_keyname, AVG(score) FROM html_parser.scores WHERE html_filenames_html_keys_html_keyname='${key}';`;

exports.sqlTotalAvgByKey =
	'SELECT html_filenames_html_keys_html_keyname, AVG(score) FROM html_parser.scores GROUP BY html_filenames_html_keys_html_keyname;';

// max route db queries
exports.max =
	'SELECT html_filenames_html_filename, score_runtime, html_filenames_html_keys_html_keyname, score FROM html_parser.scores WHERE score=(SELECT MAX(score) FROM html_parser.scores) ORDER BY score_runtime DESC;';

// min route db queries
exports.min =
	'SELECT html_filenames_html_filename, score_runtime, html_filenames_html_keys_html_keyname, score FROM html_parser.scores WHERE score=(SELECT MIN(score) FROM html_parser.scores) ORDER BY score_runtime DESC;';

// dateRange route db queries
exports.rangeSql = (date1, date2) =>
	`SELECT * FROM html_parser.scores WHERE score_runtime>='${date1}' && score_runtime<='${date2}';`;
