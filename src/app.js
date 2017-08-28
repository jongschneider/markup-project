const express = require('express');
const PORT = 3000;
const app = express();

app.get('/', (req, res, next) => {
	res.end('Its working!');
});

app.listen(PORT, () => `Now listening on port ${PORT}`);
