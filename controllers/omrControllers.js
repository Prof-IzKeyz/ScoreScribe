// controllers/omrController.js


import { runOmrPipeline } from '../services/omrPipeline.js';
import { formatSolfegeLines } from '../services/textFormatterService.js';
import { streamSolfegePdf } from '../services/pdfExportService.js'; 


export async function transcribeSheet(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({error: 'No music sheet file uploaded. Use the "sheet" field name.'});
		}

		const { buffer, originalname, mimetype } = req.file;
		const result = await runOmrPipeline(buffer, originalname, mimetype);

		return res.status(200).json({
			message: 'Music sheet transcribed to Solfege successfully.',
			pageCount: result.pageCount,
			detectedKey: `${result.key.tonic} ${result.key.mode}`,
			keyConfidence: Number(result.key.confidence.toFixed(3)),
			noteSequence: result.noteSequence,
		});
	} catch (error) {
		console.error('OMR transcription error:', error.message);
		return res.status(500).json({ error: 'Failed to process music sheet file.', details: error,message });
	}
}


export async function transcribeSheetToPdf(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No sheet music file uploaded. Use the "sheet" field name' });
		}


		const { buffer, originalname, mimetype } = req.file;
		const result = await runOmrPipeline(buffer, originalname, mimetype);

		const lines = formatSolfegeLines(result.noteSequence);

		streamSolfegePdf(res, {
			detectedKey: `${result.key.tonic} ${result.key.mode}`,
			lines,
		});
	} catch (error) {
		console.error('OMR PDF export error:', error.message);
		res.status(500).json({ error: 'Failed to generate PDF.', details: error.message });
	}
}