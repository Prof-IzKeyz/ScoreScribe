// services/textFormatterService.js


function formatNoteToken(note) {
	const main = note.solfege || '?';

	if (note.chordTones && note.chordTones.length > 0) {
		const stacked = note.chordTones.map((t) => t.solfege || '?').join('/');
		return `${main}(${stacked})`;
	}

	return main;
}


export function formatSolfegeText(noteSequence) {
	return noteSequence.map(formatNoteToken).join(' ');
}

/**
* @param {Array<{ solfege: string}>}
* @param {number} notesPerLine 
* @returns {string[]}
*/


export function formatSolfegeLines(noteSequence, notesPerLine = 8) {
	const lines = [];
	for (let i = 0; i < noteSequence.length; i +=notesPerLine) {
		const chunk = noteSequence.slice(i, i + notesPerLine);
		lines.push(chunk.map(formatNoteToken).join(' '));
	}
	return lines;
}
