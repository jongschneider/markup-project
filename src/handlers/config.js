exports.dbConfig = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'html_parser'
};

exports.testTagObj = function testTagObjFactory() {
	return [
		{
			name: 'div',
			scoreModifier: 3,
			count: 0,
			tagScore: 0
		},
		{
			name: 'p',
			scoreModifier: 1,
			count: 0,
			tagScore: 0
		},
		{
			name: 'h1',
			scoreModifier: 3,
			count: 0,
			tagScore: 0
		},
		{
			name: 'h2',
			scoreModifier: 2,
			count: 0,
			tagScore: 0
		},
		{
			name: 'html',
			scoreModifier: 5,
			count: 0,
			tagScore: 0
		},
		{
			name: 'body',
			scoreModifier: 5,
			count: 0,
			tagScore: 0
		},
		{
			name: 'header',
			scoreModifier: 10,
			count: 0,
			tagScore: 0
		},
		{
			name: 'footer',
			scoreModifier: 10,
			count: 0,
			tagScore: 0
		},
		{
			name: 'font',
			scoreModifier: -1,
			count: 0,
			tagScore: 0
		},
		{
			name: 'center',
			scoreModifier: -2,
			count: 0,
			tagScore: 0
		},
		{
			name: 'big',
			scoreModifier: -2,
			count: 0,
			tagScore: 0
		},
		{
			name: 'strike',
			scoreModifier: -1,
			count: 0,
			tagScore: 0
		},
		{
			name: 'tt',
			scoreModifier: -2,
			count: 0,
			tagScore: 0
		},
		{
			name: 'frameset',
			scoreModifier: -5,
			count: 0,
			tagScore: 0
		},
		{
			name: 'frame',
			scoreModifier: -5,
			count: 0,
			tagScore: 0
		}
	];
};
