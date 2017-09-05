import express from 'express';

import userRoutes from './user';
import clientRoutes from './client';
import authRoutes from './auth';

const router = express.Router();

router.get('/health-check', (req, res) => {
  res.json({
    status: 'ok'
  });
});

router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/auth', authRoutes);

export default router;
