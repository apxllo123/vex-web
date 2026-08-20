import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 10000;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function safePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = normalize(join(root, relative));
  return resolved.startsWith(root) ? resolved : null;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8', allow: 'GET, HEAD' });
      res.end('Method Not Allowed');
      return;
    }

    let filePath = safePath(req.url || '/');
    if (!filePath) {
      res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Bad Request');
      return;
    }

    let data;
    try {
      data = await readFile(filePath);
    } catch (error) {
      // Keep separate pages directly addressable while allowing extensionless routes.
      if (!extname(filePath)) {
        filePath = safePath(`${req.url}.html`);
        if (filePath) {
          try {
            data = await readFile(filePath);
          } catch {
            data = null;
          }
        }
      }

      if (!data) {
        filePath = join(root, 'index.html');
        data = await readFile(filePath);
      }
    }

    const type = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': type,
      'cache-control': 'public, max-age=300'
    });

    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(data);
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('VEX web server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`VEX web server listening on port ${port}`);
});
