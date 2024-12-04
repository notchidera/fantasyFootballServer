import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
	stocks: [mongoose.Schema.ObjectId], // List of stock references
	userId: { type: mongoose.Schema.ObjectId, required: true }, // User who owns the portfolio
	name: { type: String, required: true }, // Portfolio name
	description: { type: String }, // Optional description
	totalValue: { type: Number, default: 0 }, // Total value of the portfolio
	createdAt: { type: Date, default: Date.now },
});

export const Portfolio = mongoose.model('portfolio', portfolioSchema, 'portfolios');
