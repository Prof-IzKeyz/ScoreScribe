// services/textFormatterService.js


/**
* @param {Array<{ solfege: string}>}
* @returns {string}
*/


export function formatSolfegeText(noteSequence) {
	return noteSequence
	  .map((n) => n.solfege || '?')
	  .join(' ');
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
		lines.push(chunk.map((n) => n.solfege || '?').join(' '));
	}
	return lines;
}