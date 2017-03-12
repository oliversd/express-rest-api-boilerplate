import express from 'express';
import { catchErrors } from '../helpers/express-errors';

import userController from '../controllers/user-controller';

const router = express.Router();

router.get('/', catchErrors(async (req, res) => {
  try {
    const users = await userController.list(req, res);
    if (!users) { // No users on the database edge case
      res.status(200).json({ status: 'ok', message: 'No users to list', users: [] });
    } else {
      res.status(200).json({ status: 'ok', users });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}));

export default router;
