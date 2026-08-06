// app.js


import express from 'express';
import audioRoutes from './routes/audioRoutes.js';
import omrRoutes from '.routes/omrRoutes.js';
import { errorHandler } from '/middlewares/errorHandler.js';

const app = express();


app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({status: 'ok'});
});


app.use('/api/audio', audioRoutes);
app.use('/api/image', omrRoutes);

app.use(errorHandler);

export default app;
