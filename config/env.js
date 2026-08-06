// config/env.js


import 'dotenv/config';


function required(key, fallback) {
	const value = process.env[key] ?? fallback;
	if (value === undefined) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}


export const config ={
	port: Number(required('PORT', 3000)),
	audiverisCmd: required('AUDIVERIS_CMD', 'audiveris'),
};
