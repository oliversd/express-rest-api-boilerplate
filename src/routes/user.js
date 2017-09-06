import express from 'express';
import passport from 'passport';
import userController from '../controllers/user';
import validateRequest from '../config/validator/param-validator';
import { createUser, findUser, updateUser } from '../config/validator/user-schema';

const router = express.Router();

const requireAuth = passport.authenticate('bearer', {
  session: false
});


router.post('/', validateRequest(createUser), userController.createUser);
router.post('/forgot', userController.forgotPassword);
router.get('/:id/reset', userController.resetPassword);

router.get('/:id', requireAuth, validateRequest(findUser), userController.getUser);
router.put('/:id', requireAuth, validateRequest(updateUser), userController.updateUser);

router.get('/', requireAuth, userController.listUsers);
router.get('/me', requireAuth, userController.listUsers);

export default router;
