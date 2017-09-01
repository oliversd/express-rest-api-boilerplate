import { config } from 'dotenv';
import mongoose from 'mongoose';

import app from './config/app';
import { debugApp, debugMongo } from './config/debug';

// Load Enviroment variables from .env file
// this .env file must be in the root folder
// just for development
config();

mongoose.Promise = global.Promise; // set native Promise lib
/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 * https://blog.mlab.com/2014/04/mongodb-driver-mongoose/
 */
const options = {
  db: {
    native_parser: true // use the native parser
  },
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

let mongodbUri = process.env.MONGO_URI || 'mongodb://localhost/development';

if (process.env.NODE_ENV === 'test') {
  mongodbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost/test';
  debugMongo(`Starting mongodb connection on testing environment to ${mongodbUri}`);
} else if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  mongodbUri = process.env.MONGO_URI_DEV || 'mongodb://localhost/development';
  debugMongo(`Starting mongodb connection on development environment to ${mongodbUri}`);
} else {
  debugMongo('Starting mongodb connection on production environment');
}

mongoose.connect(mongodbUri, options).then(() => {
  debugMongo('Mongodb connected');
}, (err) => {
  debugMongo(`Failed to connect to mongodb ${err}`);
});

const conn = mongoose.connection;

// Set server port
const apiPort = process.env.API_PORT || 3000;

conn.once('open', () => {
  // Wait for the database connection to establish, then start the app.
  debugApp('Starting Express Server...');

  app.listen(apiPort, () => {
    debugApp(`Server running at http://127.0.0.1:${apiPort}/`);
  });
});
