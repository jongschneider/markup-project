exports.checkIfFileExists = filename =>
	`SELECT html_keys_html_keyname FROM html_parser.html_filenames WHERE html_filename='${filename}';`;

exports.addKey = key =>
	`INSERT INTO html_parser.html_keys (html_keyname) VALUE('${key}')`;

exports.addFile = (filename, key) =>
	`INSERT INTO html_parser.html_filenames (html_filename, html_keys_html_keyname) VALUE('${filename}','${key}')`;
