// services/pdfExportService.js


import PDFDocument from 'pdfkit';


/**
* @param {import('express').Response} res 
* @param {Object} options
* @param {string} options.title
* @param {string} options.detectedKey
* @param {string[]} options.lines 
*/


export function streamSolfegePdf(res, { title = 'SolfaScribe Transcription', detectedKey, lines }) {
	const doc = new PDFDocument({ size: 'A4', margin: 50 });

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `attachment; filename="solfege-transcription.pdf"`);

	doc.pipe(res);

	doc
	   .fontSize(20)
	   .font('Helvetica-Bold')
	   .text(title, { align: 'center' });

	doc.moveDown(1.0);

	if (detectedKey) {
		doc
		   .fontSize(12)
		   .font('Helvetica-Oblique')
		   .fillColor('#555555')
		   .text(`Detected Key: ${detectedKey}`, { align: 'center' });
	}

	doc.moveDown(1.5);

	doc.fillColor('#000000').font('Helvetica').fontSize(14);

	for (const line of lines) {
		doc.text(line, { align: 'left', lineGap: 8 });
	}

	doc.end();
}