import express from 'express';
import { PlayerController } from '../controllers/playerController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

router
	.route('/')
	.get(AuthController.protect, PlayerController.index)
	.post(AuthController.protect, PlayerController.store);

router
	.route('/:id')
	.delete(AuthController.protect, PlayerController.destroy)
	.patch(AuthController.protect, PlayerController.update);

export default router;
