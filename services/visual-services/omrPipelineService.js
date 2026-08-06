// services/omrPipelineService.js


import { runOmr } from './omrService.js';
import { parseMusicXml } from './omrParserService.js';
import { detectKey } from './keyDetectionService.js';
import { transposeToSolfege } from './transposerService.js';


export async function runOmrPipeline(fileBuffer, originalname, mimetype) {
	const { mxlPaths, cleanup } = await runOmr(fileBuffer, originalname);

	try {
		const { parts, pageCount } = await parseMusicXml(mxlPaths);

		// pool all voices together for one overall key detection
		const pooledNotes = parts.flatMap((p) => p.noteSequence);
		const key = detectKey(pooledNotes);

		// transpose each voice independently using the shared detected key
		const transposedParts = parts.map((part) => ({
			partId: part.partId,
			partName: part.partName,
			noteSequence: transposeToSolfege(part.noteSequence, key.tonic),
		}));

		return {
			pageCount,
			key,
			parts: transposedParts,
		};
	} finally {
		cleanup();
	}
}