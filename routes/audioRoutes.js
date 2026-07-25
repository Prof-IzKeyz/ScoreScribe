//routers/audioRoutes.js


import express from 'express';
import multer from 'multer';
import { transcribeAudio, transcribeAudioToPdf } from '../controllers/audioController.js';

const router = express.Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 15 * 1024 * 1024 },
});

router.post('/transcribe', upload.single('audio'), transcribeAudio);
router.post('/transcribe-pdf', upload.single('audio'), transcribeAudioToPdf);

export default router;