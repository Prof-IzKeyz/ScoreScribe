// app.js

import express from 'express';
import audioRoutes from './routes/audioRoutes.js';

const app = express();


app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({status: 'ok'});
});


app.use('/api/audio', audioRoutes);

export default app;
