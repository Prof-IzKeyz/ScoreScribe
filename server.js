// server.js


import 'dotenv/config';
import app from './app.js';

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`SolfaScribe server running on http://localhost:${PORT}`);
});
