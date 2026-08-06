// services/noteSmoothingService.js


/**
* @param {Array<{ time: number, note: string, octave: number }>}
* @returns {Array<{ note: string, octave: number, startTime: number, endTime: number, duration: number }>}
*/


export function smoothNoteSequence(mappedNotes) {
	if (mappedNotes.length === 0) return[];

	const smoothed = [];
	let current = {
		note: mappedNotes[0].note,
		octave: mappedNotes[0].octave,
		startTime: mappedNotes[0].time,
		endTime: mappedNotes[0].time,
	};

	for (let i = 1; i < mappedNotes.length; i++) {
		const { note, octave, time } = mappedNotes[i];

		if (note === current.note) {
			current.endTime = time;
		} else {
			smoothed.push(finalizeNote(current));
			current = { note, octave, startTime: time, endTime: time };
		}
	}

	smoothed.push(finalizeNote(current));

	return smoothed;
}

	function finalizeNote( { note, octave, startTime, endTime }) {
		return {
			note,
			octave,
			startTime: Number(startTime.toFixed(3)),
			endTime: Number(endTime.toFixed(3)),
			duration: Number((endTime - startTime).toFixed(3)),
		};
	}

	export function filterShortNotes(smoothedNotes, minDuration = 0.08) {
		return smoothedNotes.filter((note) => note.duration >= minDuration);
	}