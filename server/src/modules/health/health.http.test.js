import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../../app.js';

/**
 * HTTP-level tests. We build the Express app (which uses the real container)
 * but never connect to MongoDB — the Mongoose readyState will be 0 (disconnected).
 */

function request(server, method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://127.0.0.1:${server.address().port}`);
    const req = http.request(url, { method }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

describe('HTTP /api/v1/health', () => {
  let server;

  beforeEach(() => {
    return new Promise((resolve) => {
      const app = createApp();
      server = app.listen(0, resolve); // port 0 = OS picks a free port
    });
  });

  afterEach(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('returns 503 when DB is not connected', async () => {
    const res = await request(server, 'GET', '/api/v1/health');
    assert.equal(res.status, 503);
    assert.equal(res.body.db, 'disconnected');
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(server, 'GET', '/api/v1/nonexistent');
    assert.equal(res.status, 404);
    assert.equal(res.body.code, 'NOT_FOUND');
    assert.ok(res.body.message);
  });
});
