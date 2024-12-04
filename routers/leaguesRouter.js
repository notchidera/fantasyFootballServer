import express from 'express';
import { LeagueController } from '../controllers/leagueController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

router
    .route('/')
    .get(AuthController.protect, LeagueController.index) // Fetch all leagues
    .post(AuthController.protect, LeagueController.store); // Create a new league

router
    .route('/:id')
    .get(AuthController.protect, LeagueController.show) // Get league details
    .delete(AuthController.protect, LeagueController.destroy); // Delete a league

router.post('/:id/join', AuthController.protect, LeagueController.join); // Join a league
router.post('/:id/notify-standings', AuthController.protect, LeagueController.notifyStandings); // Notify standings

export default router;
