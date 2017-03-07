import http from 'http';
import debugModule from 'debug';
import { config } from 'dotenv';

// Load Enviroment variables from .env file
// this .env file must be in the root folder
// just for development
config();

// Set debug namespace for our app
const debug = debugModule('app');

// Set server port
const apiPort = process.env.API_PORT || 3000;


debug('Starting Express Boilerplate...');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!!!\n');
}).listen(apiPort, '127.0.0.1');

debug(`Server running at http://127.0.0.1:${apiPort}/`);
