import express from 'express';
import passport from 'passport';
import userController from '../controllers/user';
import validateRequest from '../config/validator/param-validator';
import { createUser, findUser, updateUser } from '../config/validator/user-schema';
import roleFilter from '../middlewares/role-filter';

const router = express.Router();

const requireAuth = passport.authenticate('bearer', {
  session: false
});


router.post('/', validateRequest(createUser), userController.createUser);
router.post('/forgot', userController.forgotPassword);
router.get('/:id/reset', userController.resetPassword);

router.get('/:id', requireAuth, roleFilter('user'), validateRequest(findUser), userController.getUser);
router.put('/:id', requireAuth, roleFilter('user'), validateRequest(updateUser), userController.updateUser);

router.get('/', requireAuth, roleFilter('user'), userController.listUsers);
router.get('/me', requireAuth, roleFilter('user'), userController.listUsers);

export default router;
