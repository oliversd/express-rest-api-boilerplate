import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';

import routes from '../routes/health';

const app = express();

app.use(methodOverride());
app.use(helmet()); // for a little security. https://github.com/helmetjs/helmet
app.use(cors());

app.use('/api', routes);

// Configure bodyParser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // use qs library https://github.com/expressjs/body-parser#extended

app.use((req, res, next) => {
  res.status(404).json({ status: 'error', error: 'Sorry endpoint not found!' });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', error: err.message });
  next(err);
});

export default app;
