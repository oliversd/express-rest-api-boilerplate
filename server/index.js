import http from 'http';
import debugModule from 'debug';

const debug = debugModule('app');

debug('Starting Express Boilerplate...');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!!!\n');
}).listen(3000, '127.0.0.1');

debug('Server running at http://127.0.0.1:3000/');
