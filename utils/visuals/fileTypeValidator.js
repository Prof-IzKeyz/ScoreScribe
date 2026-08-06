// utils/fileTypeValidator.js


const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'application/pdf',
];



export function omrFileFilter(req, file, cb) {
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error(`Unsupported file type: ${file.mimetype}. Upload an image (JPEG/PNG/WEBP) or a PDF.`));
	}
}
