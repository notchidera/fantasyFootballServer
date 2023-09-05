import express from 'express';
import { UserController } from '../controllers/userController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();
router.post('/signup', AuthController.signup);
router
	.route('/login')
	.post(AuthController.login)
	.get(AuthController.protect, UserController.show);
router.get('/logout', AuthController.logout);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

router
	.route('/')
	.get(AuthController.protect, UserController.index)
	.post(UserController.store)
	.patch(AuthController.protect, UserController.update);

router.route('/:id').delete(UserController.destroy);

export default router;
