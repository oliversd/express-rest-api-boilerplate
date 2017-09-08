import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import expressValidator from 'express-validator';
import passport from 'passport';

import { debugApp } from './debug';
import logger from '../helpers/logger';

import routes from '../routes/routes';
import { globalRateLimit } from '../middlewares/limit-rate';
import debugRoute from '../middlewares/debug-route';

const app = express();

app.use(methodOverride());

require('../authentication/auth');
require('./seed');

// Configure bodyParser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // use qs library https://github.com/expressjs/body-parser#extended
app.use(expressValidator());

app.use(helmet()); // for a little security. https://github.com/helmetjs/helmet
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', globalRateLimit, debugRoute, routes);

app.use((req, res, next) => {
  debugApp('Route not found');
  res.status(404).json({ status: 'error', message: 'Sorry endpoint not found!' });
  next();
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ status: 'error', message: err.message, error: err });
  next(err);
});

export default app;
