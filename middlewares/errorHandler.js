// middlewares/errorHandler.js


import multer from 'multer';


export function errorHandler(err, req, res, next) {
	console.error('Error:', err.message);

	if (err instanceof multer.MulterError) {
		return res.status(400).json({error: 'Upload error', details: err.message});
	}

	if (err.message?.startsWith('Unsupported file type')) {
		return res.status(400).json({ error: err.message });
	}

	return res.status(err.status || 500).json({
		error: 'Something went wrong.',
		details: err.message,
	});
}