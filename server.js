import express from 'express';
import cors from 'cors';
import { handler } from './handler.js';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// Initialize cache with a maximum size of 2GB
const cache = new LRUCache({
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB in bytes
    sizeCalculation: (value, key) => value.body.length,
    ttl: 60 * 60 * 24 * 7, // 1 week
    allowStale: true,
});

// Function to create a hash of the cache key
const hashKey = (key) => {
    return crypto.createHash('sha256').update(key).digest('hex');
};

const app = express();

app.use(cors({ origin: '*' }));

app.get('/healthcheck', (req, res) => {
    res.end('ok');
});

app.get('/favicon', (req, res) => {
    res.sendFile('favicon.ico', { root: 'static' });
});

// Helper function to proxy requests
const proxyRequest = async (req, res, targetUrl) => {
    const cacheKey = hashKey(req.path);

    if (cache.has(cacheKey)) {
        // Serve from cache
        const cachedResponse = cache.get(cacheKey);
        res.set(cachedResponse.headers);
        res.status(cachedResponse.statusCode).send(cachedResponse.body);
        return;
    }

    try {
        const proxyRes = await fetch(targetUrl + req.path, {
            method: req.method,
            headers: req.headers
        });

        const body = await proxyRes.arrayBuffer();
        const headers = {};
        proxyRes.headers.forEach((value, name) => {
            headers[name] = value;
        });

        const cachedResponse = {
            statusCode: proxyRes.status,
            headers: headers,
            body: Buffer.from(body),
            length: body.byteLength
        };

        // Store in cache
        cache.set(cacheKey, cachedResponse);

        res.set(headers);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.status(proxyRes.status).send(Buffer.from(body));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Proxy configuration for images.eve-kill.com
app.use(async (req, res, next) => {
    if (req.hostname === 'images.eve-kill.com') {
        await proxyRequest(req, res, 'https://images.evetech.net');
    } else {
        next();
    }
});

// Use the existing handler for other routes
app.use(handler);

app.listen(3000, () => {
    console.log('Server listening on http://0.0.0.0:3000');
});
