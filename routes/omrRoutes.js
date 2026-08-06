// routes/imageRoutes.js


import express from 'express';
import multer from 'multer';
import { omrFileFilter } from '../utils/fileTypeValidator.js';
import { transcribeSheet, transcribeSheetToPdf } from '../controllers/omrController.js';

const router = express.Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 25 * 1024 * 1024 },
	fileFilter: omrFileFilter,
});


router.post('/transcribe', upload.single('sheet'), transcribeSheet);
router.post('/transcribe-pdf', upload.single('sheet'), transcribeSheetToPdf);

export default router;
