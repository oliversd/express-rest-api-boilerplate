import { config } from 'dotenv';
import app from './config/app';
import debug from './config/debug';

// Load Enviroment variables from .env file
// this .env file must be in the root folder
// just for development
config();

// Set server port
const apiPort = process.env.API_PORT || 3000;

debug('Starting Express Boilerplate...');

app.listen(apiPort, () => {
  debug(`Server running at http://127.0.0.1:${apiPort}/`);
});
