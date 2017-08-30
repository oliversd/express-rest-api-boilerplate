import express from 'express';
import { catchErrors } from '../helpers/express-errors';

import userRoutes from './user-routes';

const router = express.Router();

router.get('/health-check', catchErrors(async (req, res) => {
  res.json({
    status: 'ok'
  });
}));

router.use('/user', userRoutes);

export default router;
