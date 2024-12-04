import express from 'express';
import { StockController } from '../controllers/stockController.js';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

router
    .route('/')
    .get(AuthController.protect, StockController.index) // Fetch stocks
    .post(AuthController.protect, StockController.store); // Add stocks

router
    .route('/:id')
    .delete(AuthController.protect, StockController.destroy) // Delete a stock
    .patch(AuthController.protect, StockController.update); // Update a stock

export default router;
