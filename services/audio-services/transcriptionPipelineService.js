// services/transcriptionPipelineService.js


import { convertToWav } from '../utils/convertToWav.js';
import { parseWavFile } from '../utils/audioFileParser.js';
import { detectPitch, getDetectedNotesOnly } from './pitchDetectionService.js';
import { mapPitchesToNotes } from './noteMappingService.js';
import { smoothNoteSequence, filterShortNotes } from './noteSmoothingService.js';
import { detectKey } from './keyDetectionService.js';
import { transposeToSolfege } from './transposerService.js';


/**
* @param {Buffer} fileBuffer
* @param {string} originalname
* @returns {Promise<{
	sampleRate: number,
	duration: number,
	channels: number,
	key:{ tonic: string, mode: string, confidence: number },
	noteSequence: Array
}>}
*/


export async function runTranscriptionPipeline(fileBuffer, originalname) {
		const wavBuffer = await convertToWav(fileBuffer, originalname);
		const { sampleRate, samples, duration, channels } = await parseWavFile(wavBuffer);

		const pitchData = detectPitch(samples, sampleRate);
		const detectedNotes = getDetectedNotesOnly(pitchData);
		const mappedNotes = mapPitchesToNotes(detectedNotes);

		const smoothed = smoothNoteSequence(mappedNotes);
		const cleanNotes = filterShortNotes(smoothed);
		

		const key = detectKey(cleanNotes);
		const noteSequence = transposeToSolfege(cleanNotes, key.tonic);

	return {
		sampleRate,
		duration: Number(duration.toFixed(2)),
		channels,
		key,
		noteSequence,
	};
}