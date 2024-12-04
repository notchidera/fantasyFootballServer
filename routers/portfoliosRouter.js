import express from 'express';
import { PortfolioController } from '../controllers/portfolioController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

router
    .route('/')
    .get(AuthController.protect, PortfolioController.index) // Fetch portfolios
    .post(AuthController.protect, PortfolioController.store); // Create a portfolio

router
    .route('/:id')
    .delete(AuthController.protect, PortfolioController.destroy) // Delete a portfolio
    .patch(AuthController.protect, PortfolioController.update); // Update a portfolio

router.post(
    '/calculate-scores/:leagueId',
    AuthController.protect,
    PortfolioController.calculateScores
); // Calculate portfolio scores for a league

export default router;
