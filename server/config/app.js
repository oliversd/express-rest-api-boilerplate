import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import expressValidator from 'express-validator';

import { debugApp } from '../config/debug';

import routes from '../routes/routes';

const app = express();

app.use(methodOverride());

// Configure bodyParser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // use qs library https://github.com/expressjs/body-parser#extended
app.use(expressValidator());

app.use(helmet()); // for a little security. https://github.com/helmetjs/helmet
app.use(cors());

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({ status: 'error', error: 'Sorry endpoint not found!' });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', error: err });
  next(err);
});

export default app;
