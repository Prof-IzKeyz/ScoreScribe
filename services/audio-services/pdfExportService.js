// services/pdfExportService.js


import PDFDocument from 'pdfkit';



export function streamSolfegePdf(res, { title = 'SolfaScribe Transcription', detectedKey, lines, voiceSections }) {
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


	const sections = voiceSections || [{ label: null, lines: lines || [] }];


	for (const section of sections) {
	if (section.label) {
		doc
		   .fontSize(14)
		   .font('Helvetica-Bold')
		   .fillColor('#222222')
		   .text(section.label, { align: 'left' });


		doc.moveDown(0.3);
	}

	doc.fillColor('#000000').font('Helvetica').fontSize(14);

	for (const line of section.lines) {
		doc.text(line, { align: 'left', lineGap: 8 });
	}

	doc.moveDown(1.0);
  }

	doc.end();
}
