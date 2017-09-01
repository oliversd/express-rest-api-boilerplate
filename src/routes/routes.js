import express from 'express';

import userRoutes from './user-routes';
import clientRoutes from './client-routes';
import authRoutes from './auth-routes';

const router = express.Router();

router.get('/health-check', (req, res) => {
  res.json({
    status: 'ok'
  });
});

router.use('/user', userRoutes);
router.use('/client', clientRoutes);
router.use('/auth', authRoutes);

export default router;
