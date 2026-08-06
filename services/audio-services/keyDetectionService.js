// services/keyDetectionService.js


const NOTE_NAMES = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];


/**
* @param {Arrays<{ note: string, duration: number}>}
* @returns {number[]}
*/


function buildPitchClassHistogram(smoothedNotes) {
	const histogram = new Array(12).fill(0);

	for (const {note, duration} of smoothedNotes) {
		const index = NOTE_NAMES.indexOf(note);
		if (index !== -1) {
			histogram[index] += duration;
		}
	}

	return histogram;
}


function correlate(histogram, profile) {
	const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
	const histMean = mean(histogram);
	const profMean = mean(profile);

	let numerator = 0;
	let histDenom = 0;
	let profDenom = 0;

	for (let i = 0; i < 12; i++) {
		const histDiff = histogram[i] - histMean;
		const profDiff = profile[i] - profMean;
		numerator += histDiff * profDiff;
		histDenom += histDiff * histDiff;
		profDenom += profDiff * profDiff;
	}

	const denominator = Math.sqrt(histDenom * profDenom);
	return denominator === 0 ? 0 : numerator / denominator;
}



/**
* @param {Arrays<{ note: string, duration: number}>}
* @returns {{ tonic: string, mode: 'major' | 'minor', confidence: number }}
*/


export function detectKey(smoothedNotes) {
	const histogram = buildPitchClassHistogram(smoothedNotes);

	let bestMatch = { tonic: 'C', mode: 'major', confidence: -Infinity };

	for (let rotation = 0; rotation < 12; rotation++) {
		const rotatedMajor = rotateProfile(MAJOR_PROFILE, rotation);
		const rotatedMinor = rotateProfile(MINOR_PROFILE, rotation);

		const majorScore = correlate(histogram, rotatedMajor);
		const minorScore = correlate(histogram, rotatedMinor);

		if (majorScore > bestMatch.confidence) {
			bestMatch = { tonic: NOTE_NAMES[rotation], mode: 'major', confidence: majorScore };
		}
		if (minorScore > bestMatch.confidence) {
			bestMatch = { tonic: NOTE_NAMES[rotation], mode: 'minor', confidence: minorScore };
		}
	}
	return bestMatch;
}

function rotateProfile(profile, rotation) {
	return profile.map ((_, i) => profile[(i - rotation + 12) % 12]);
}
