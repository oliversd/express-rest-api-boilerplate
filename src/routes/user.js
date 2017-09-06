import express from 'express';

import userController from '../controllers/user';
import validateRequest from '../config/validator/param-validator';
import { createUser, findUser, updateUser } from '../config/validator/user-schema';

const router = express.Router();

router.get('/', userController.listUsers);

router.post('/', validateRequest(createUser), userController.createUser);

router.get('/:id', validateRequest(findUser), userController.getUser);

router.put('/:id', validateRequest(updateUser), userController.updateUser);

router.post('/forgot', userController.forgotPassword);

router.get('/:id/reset', userController.resetPassword);

export default router;
