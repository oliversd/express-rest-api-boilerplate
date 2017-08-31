import express from 'express';
import userRoutes from './user-routes';

const router = express.Router();

router.get('/health-check', (req, res, next) => {
  try {
    res.json({
      status: 'ok'
    });
  } catch (err) {
    next(err);
  }
});

router.use('/user', userRoutes);

export default router;
