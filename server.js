import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handler } from './handler.js';

const app = express();

app.use(cors({ origin: '*' }));

app.get('/healthcheck', (req, res) => {
    res.end('ok');
});

app.get('/favicon', (req, res) => {
    res.sendFile('favicon.ico', { root: 'static' });
});

// Proxy configuration for images.eve-kill.com
app.use((req, res, next) => {
    if (req.hostname === 'images.eve-kill.com') {
        const proxy = createProxyMiddleware({
            target: 'https://images.evetech.net',
            changeOrigin: true,
            pathRewrite: (path, req) => path,  // Keep the path as is
            onProxyReq: (proxyReq, req, res) => {
                // Preserve headers
                Object.keys(req.headers).forEach(key => {
                    proxyReq.setHeader(key, req.headers[key]);
                });
            },
            onProxyRes: (proxyRes, req, res) => {
                // Preserve headers
                Object.keys(proxyRes.headers).forEach(key => {
                    res.setHeader(key, proxyRes.headers[key]);
                });
            }
        });
        proxy(req, res, next);
    } else {
        next();
    }
});

// Use the existing handler for other routes
app.use(handler);

app.listen(3000, () => {
    console.log('Server listening on http://0.0.0.0:3000');
});
