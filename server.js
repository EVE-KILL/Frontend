import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handler } from './handler.js';
import { LRUCache } from 'lru-cache';

// Initialize cache with a maximum size of 2GB
const cache = new LRUCache({
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB in bytes
    sizeCalculation: (value, key) => value.body.length,
});

const app = express();

app.use(cors({ origin: '*' }));

app.get('/healthcheck', (req, res) => {
    res.end('ok');
});

app.get('/favicon', (req, res) => {
    res.sendFile('favicon.ico', { root: 'static' });
});

// Proxy configuration for images.eve-kill.com
app.use(async (req, res, next) => {
    if (req.hostname === 'images.eve-kill.com') {
        const cacheKey = req.originalUrl;

        if (cache.has(cacheKey)) {
            // Serve from cache
            const cachedResponse = cache.get(cacheKey);
            res.set(cachedResponse.headers);
            res.status(cachedResponse.statusCode).send(cachedResponse.body);
        } else {
            const proxy = createProxyMiddleware({
                target: 'https://images.evetech.net',
                changeOrigin: true,
                pathRewrite: (path, req) => path, // Keep the path as is
                onProxyReq: (proxyReq, req, res) => {
                    // Preserve headers
                    Object.keys(req.headers).forEach(key => {
                        proxyReq.setHeader(key, req.headers[key]);
                    });
                },
                onProxyRes: (proxyRes, req, res) => {
                    // Extend cache headers
                    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year

                    let body = [];
                    proxyRes.on('data', chunk => {
                        body.push(chunk);
                    });

                    proxyRes.on('end', () => {
                        body = Buffer.concat(body);
                        const cachedResponse = {
                            statusCode: proxyRes.statusCode,
                            headers: proxyRes.headers,
                            body: body
                        };

                        // Store in cache
                        cache.set(cacheKey, cachedResponse);

                        res.set(cachedResponse.headers);
                        res.status(cachedResponse.statusCode).send(cachedResponse.body);
                    });
                }
            });
            proxy(req, res, next);
        }
    } else {
        next();
    }
});

// Use the existing handler for other routes
app.use(handler);

app.listen(3000, () => {
    console.log('Server listening on http://0.0.0.0:3000');
});
