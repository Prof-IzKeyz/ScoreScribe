// services/omrService.js


import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { config } from '../config/env.js';



export function runOmr(fileBuffer, originalname) {
	return new Promise((resolve, reject) => {
		const tempDir = os.tmpdir();
		const jobId = `omr-${Date.now()}`;
		const inputExt = path.extname(originalname) || '.tmp';
		const iputPath = path.join(tempDir, `${jobId}${inputExt}`);
		const outputDir = path.join(tempDir, `${jobId}-out`);

		fs.writeFileSync(inputPath, fileBuffer);
		fs.mkdirSync(outputDir, { recursive: true });

		const audiveris = spawn(config.audiverisCmd, [
			'-batch',
			'-export',
			'-output', outputDir,
			inputPath,
		]);

		let stderr = '';
		audiveris.stderr.on('data', (chunk) => {
			stderr += chunk.toString();
		});

		audiveris.on('error', (err) => {
			cleanupInput();
			reject(new Error(`Failed to start Audiveris: ${err.message}`));
		});

		audiveris.on('close', (code) => {
			cleanupInput();

			if (code !== 0) {
				return reject(new Error(`Audiveris exited with code ${code}: ${stderr}`));
			}

			const mxlPaths = findExportedMxl(outputDir);

			if (mxlPaths.length === 0) {
				return reject(new Error('Audiveris finished but no MusicXML output was found.'));
			}

			resolve({
				mxlPaths,
				cleanup: () => fs.rmSync(outputDir, {recursive: true, force: true }),
			});
		});

		function cleanupInput() {
			if (fs.existsSync(inputPath)) fs.unlikeSync(inputPath);
		}
	});
}



function findExportedMxlFiles(outputDir) {
	const found = fs.readdirSync(outputDir, { recursive: true })
		.filter((f) => f.endsWith('.mxl'))
		.sort();


		return found.map((f) => path.join(outputDir, f));
}
