// utils/convertToWav.js


import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

ffmpeg.setFfmpegPath(ffmpegPath);


/**
* @param {Buffer} fileBuffer
* @param {string} originalFilename
* @returns {Promise<Buffer>}
*/


export function convertToWav(fileBuffer, originalFilename) {
	return new Promise((resolve, reject) => {
		const tempDir = os.tmpdir();
		const inputExt = path.extname(originalFilename) || '.tmp';
		const inputPath = path.join(tempDir, `input-${Date.now()}${inputExt}`);
		const outputPath = path.join(tempDir, `output-${Date.now()}.wav`);

		fs.writeFileSync(inputPath, fileBuffer);

		ffmpeg(inputPath)
		  .toFormat('wav')
		  .audioChannels(1)
		  .audioFrequency(44100)
		  .on('end', ()=> {
		  	const wavBuffer = fs.readFileSync(outputPath);

		  	fs.unlinkSync(inputPath);
		  	fs.unlinkSync(outputPath);

		  	resolve(wavBuffer);
		  })
		  .on('error', (err) => {

		  	if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
		  	if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
		  	reject(new Error(`ffmpeg conversion failed: ${err.message}`));
		  })
		  .save(outputPath);
	});
}