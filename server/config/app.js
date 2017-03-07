import express from 'express';
import routes from '../routes/health';

const app = express();

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Sorry can't find that!" });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).json({ status: 500, error: err.message });
  next(err);
});

export default app;
