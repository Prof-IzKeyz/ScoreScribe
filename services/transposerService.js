// services/transposerService.js

const NOTE_NAMES = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SOLFEGE_DEGREES = [ 'Doh', 'De', 'Reh', 'Re', 'Mi', 'Fah', 'Fe', 'Sol', 'Se', 'Lah', 'Le', 'Ti'];


/**
* @param {string} tonic 
* @returns {Object} 
*/


export function buildMoveableDohMap(tonic) {
	const tonicIndex = NOTE_NAMES.indexOf(tonic);
	const map = {};

	for (let i = 0; i < 12; i++) {
		const noteIndex = (tonicIndex + i) %12;
		map[NOTE_NAMES[noteIndex]] = SOLFEGE_DEGREES[i];
	}

	return map;
}


/**
* @param {Arrays<{ note: string }>}
* @param {string} tonic 
* @returns {Array}
*/

export function transposeToSolfege(noteSequence, tonic) {
	const dohMap = buildMoveableDohMap(tonic);

	return noteSequence.map((item) => ({
		...item,
		solfege: dohMap[item.note] || null,
	}));
}
