import express from 'express';
import { TeamController } from '../controllers/teamController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

router
	.route('/')
	.get(AuthController.protect, TeamController.index)
	.post(AuthController.protect, TeamController.store);

router
	.route('/:id')
	.delete(AuthController.protect, TeamController.destroy)
	.patch(AuthController.protect, TeamController.update);

export default router;
