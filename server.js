// server.js


import app from './app.js';
import { config } from './config/env.js';

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`SolfaScribe server running on http://localhost:${PORT}`);
});
