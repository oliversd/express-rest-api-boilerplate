import express from 'express';
import { catchErrors } from '../helpers/expressErrors';

const router = express.Router();

router.get('/health-check', catchErrors(async (req, res) => {
  res.json({
    status: 'ok'
  });
}));

export default router;
