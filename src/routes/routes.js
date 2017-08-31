import express from 'express';
import userRoutes from './user-routes';

const router = express.Router();

router.get('/health-check', (req, res) => {
  res.json({
    status: 'ok'
  });
});

router.use('/user', userRoutes);

export default router;
