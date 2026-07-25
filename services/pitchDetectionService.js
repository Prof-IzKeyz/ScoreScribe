// services/pitchDetectionService.js


import Pitchfinder from 'pitchfinder';

/**
* @param {Float32Array} samples
* @param {number} sampleRate
* @param {number} windowSize
* @returns {Array<{tine: number, frequency: number || null}>}
*/


export function detectPitch(samples, sampleRate, windowSize = 2048) {
	const detectPitchYIN = Pitchfinder.YIN({ sampleRate });
	const results = [];

	for (let i = 0; i < samples.length; i += windowSize) {
		const window = samples.slice(i, i + windowSize);

		if (window.length < windowSize) break;

		const frequency = detectPitchYIN(window);
		const time = i / sampleRate;

		results.push({ time: Number(time.toFixed(3)), frequency});
	}

	return results;
}

export function getDetectedNotesOnly(pitchResults) {
	return pitchResults.filter((r) => r.frequency !== null);
}