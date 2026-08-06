// services/noteMappingService.js


const NOTE_NAMES = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
* @param {number} frequency
* @returns {{ note: string, octave: number, noteWithOctave: string}}
*/


export function frequencyToNOte(frequency) {
	const A4 = 440;

	const semitonesFromA4 = 12 * Math.log2(frequency / A4);
	const roundedSemitones = Math.round(semitonesFromA4);

	const midiNote = 69 + roundedSemitones;

	const noteIndex = ((midiNote % 12) + 12) % 12;
	const note = NOTE_NAMES[noteIndex];
	const octave = Math.floor(midiNote / 12) - 1;

	return { note, octave, noteWithOctave: `${note}${octave}`};
}



/**
* @param {Array<{ time: number, frequency: number }>}
* @returns{Array<{time: number, frequency: number, note: string, octave: number, solfege: string }>}
*/


export function mapPitchesToNotes(detectedNotes) {
	return detectedNotes.map(({ time, frequency }) => {
		const { note, octave } = frequencyToNOte(frequency);
		return { time, frequency, note, octave, };
	});
}
