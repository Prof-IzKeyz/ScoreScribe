// controllers/audioController.js


import { runTranscriptionPipeline } from '../services/transcriptionPipelineService.js';
import { formatSolfegeLines } from '../services/textFormatterService.js';
import { streamSolfegePdf } from '../services/pdfExportService.js'; 


export async function transcribeAudio(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No audio file uploaded. Use the "audio" field name.' });
		}

		const { buffer, originalname } = req.file;
		const result = await runTranscriptionPipeline(buffer, originalname);

		return res.status(200).json({
			message: 'Audio transcribed to Solfege succesfully.',
			sampleRate: result.sampleRate,
			duration: result.duration,
			channels: result.channels,
			detectedKey: `${result.key.tonic} ${result.key.mode}`,
			keyConfidence: Number(result.key.confidence.toFixed(3)),
			noteSequence: result.noteSequence,
		});
	} catch (error) {
		console.error('Transcription error:', error.message);
		return res.status(500).json({ error: 'Failed to process audio file.', details: error.message });
	}
}

export async function transcribeAudioToPdf(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No audio file uploaded. Use the "audio" field name.' });
		}

		const { buffer, originalname } = req.file;
		const result = await runTranscriptionPipeline(buffer, originalname);

		const lines = formatSolfegeLines(result.noteSequence);	

		streamSolfegePdf(res, {
			detectedKey: `${result.key.tonic} ${result.key.mode}`,
			lines,
		});
	} catch (error) {
		console.error('PDF export error:', error.message);
		res.status(500).json({ error: 'Failed to generate PDF.', details: error.message })
	}
} 