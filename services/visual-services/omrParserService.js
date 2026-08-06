// services/omrParserService.js

import JSZip from 'jszip';
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

const STEP_TO_NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

async function extractMusicXml(mxlPath) {
	const buffer = fs.readFileSync(mxlPath);
	const zip = await JSZip.loadAsync(buffer);

	const scoreFile = Object.keys(zip.files).find(
		(name) => name.endsWith('.xml') && !name.startsWith('META-INF')
	);

	if (!scoreFile) {
		throw new Error('No MusicXML score found inside .mxl archive.');
	}

	return zip.files[scoreFile].async('text');
}

function pitchToNote(pitch) {
	let semitone = STEP_TO_NOTE[pitch.step];
	if (pitch.alter) semitone += Number(pitch.alter);
	semitone = ((semitone % 12) + 12) % 12;

	return { note: NOTE_NAMES[semitone], octave: Number(pitch.octave) };
}


function extractPartNames(scorePartwise) {
	const partList = scorePartwise['part-list']?.['score-part'];
	const entries = Array.isArray(partList) ? partList : [partList];
	const names = {};

	for (const entry of entries) {
		if (!entry) continue;
		names[entry['@_id']] = entry['part-name'] || entry['@_id'];
	}

	return names;
}


function parsePartNotes(part, pageNumber) {
	const measures = Array.isArray(part.measure) ? part.measure : [part.measure];
	const voices = {};


	function getVoice(voiceNum) {
		if (!voices[voiceNum]){
			voices[voiceNum] = { cursor: 0, noteSequence: [] };
		}
		return voices[voiceNum];
	}

	for (const measure of measures) {
		if (!measure) continue;
		const notes = measure.noteSequence
			? (Array.isArray(measure.note) ? measure.note : [measure.note])
			: [];

		for (const noteEl of notes) {
			const voiceNum = noteEl.voice ?? '1';
			const voice = getVoice(voiceNum);
			const duration = Number(noteEl.duration) || 0;
			const isChordTone = noteEl.chord !== undefined;

			if (!noteEl.pitch) {
				// rest — advance cursor, no chord tones possible on a rest
				if (!isChordTone) cursor += duration;
				continue;
			}

			const { note, octave } = pitchToNote(noteEl.pitch);

			if (isChordTone && noteSequence.length > 0) {
				// stack onto the previous moment instead of creating a new one
				const last = noteSequence[noteSequence.length - 1];
				last.chordTones = last.chordTones || [];
				last.chordTones.push({ note, octave });
				continue;
			}

			voice.noteSequence.push({
				note,
				octave,
				page: pageNumber,
				startTime: voice.cursor,
				endTime: voice.cursor + duration,
				duration,
			});

			voice.cursor += duration;
		}
	}

	return voices;
}


export async function parseMusicXml(mxlPaths) {
	const mergedParts ={};


	for (let pageIndex = 0; pageIndex < mxlPaths.length; pageIndex++) {
		const pageNumber = pageIndex + 1;
		const xmlString = await extractMusicXml(mxlPath);
		const doc = parser.parse(xmlString);

		const scorePartwise = doc['score-partwise'];
		if (!scorePartwise) {
			throw new Error('Unsupported MusicXML format (expected score-partwise).');

	}

	const partNames = extractPartNames(scorePartwise);
	const rawParts = Array.isArray(scorePartwise.part) ? scorePartwise.part : [scorePartwise.part];

	for (const part of rawParts) {
		const partId = part['@_id'];
		const voices = parsePartNotes(part, pageNumber);
		

		for (const [voiceNum, voiceData] of Object.entries(voices)) {
			const key = `${partId}-v${voiceNum}`;
			const baseName = partNames[partId] || partId;
			const label = Object.keys(voices).length > 1 ? `${baseName} (voice ${voiceNum})` : baseName;


			if (!mergedParts[key]) {
				mergedParts[key] = { partName: label, noteSequence: [] };
			}
			mergedParts[key].noteSequence.push(...voiceData.noteSequence);
		}
	}
}

const parts = Object.entries(mergedParts).map(([partId, data]) => ({
	partId,
	partName: data.partName,
	noteSequence: data.noteSequence,
}));

	return {
		parts,
		pageCount: mxlPaths.length,
	};
}
