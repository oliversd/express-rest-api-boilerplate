import express from 'express';

import { catchErrors } from '../helpers/express-errors';
import userController from '../controllers/user-controller';
import validateRequest from '../config/validator/param-validator';
import createUser from '../config/validator/user-schema';

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

router.post('/', validateRequest(createUser), catchErrors(async (req, res) => {
  try {
    const user = await userController.create(req, res);
    if (!user) { // No users on the database edge case
      res.status(200).json({ status: 'error', message: 'User not created', user: [] });
    } else {
      res.status(200).json({ status: 'ok', user });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}));

/* router.post('/', (req, res, next) => {
  req.check('email', 'Invalid email').isEmail();
  const errors = req.validationErrors();
  if (errors) {
    res.json({ status: 'error', message: errors });
    return;
  }
  res.json({ status: 'ok', message: 'Hello there' });
  next();
});
*/

export default router;
