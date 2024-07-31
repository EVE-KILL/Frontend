import { handler } from './handler.js';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

app.get('/favicon', (req, res) => {
	res.sendFile('favicon.ico', { root: 'static' });
});

app.use(handler);

app.listen(3000, () => {
	console.log('Server listening on http://0.0.0.0:3000');
});
