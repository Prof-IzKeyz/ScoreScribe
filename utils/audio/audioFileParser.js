// utils/audioFileParser.js


import wavDecoder from 'wav-decoder';

/**
* @params {Buffer} fileBuffer
* @returns {Promise<{ sampleRate: number, samples:Float32Array, channels: number, duration: number}>}
*/


export async function parseWavFile(fileBuffer){
	try {
		const audioData = await wavDecoder.decode(fileBuffer);

		const samples = audioData.channelData[0];
		const sampleRate = audioData.sampleRate;
		const channels = audioData.channelData.length;
		const duration = samples.length / sampleRate;

		return {sampleRate, samples, channels, duration };
	} catch (error) {
		throw new Error(`Failed to parse .wav file: ${error.message}`);
	}
}