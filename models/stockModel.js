import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
	{
		tickerSymbol: { type: String, required: true }, // Stock ticker symbol (e.g., AAPL)
		companyName: { type: String, required: true }, // Full company name
		initialPrice: { type: Number, required: true }, // Price at the time of addition
		currentPrice: { type: Number, required: true }, // Most recent price
		sector: { type: String }, // Stock sector (e.g., Technology, Finance)
		userId: { type: mongoose.Schema.ObjectId, required: true }, // User who owns this stock
	},
	{ timestamps: true }
);

export const Stock = mongoose.model('stock', stockSchema, 'stocks');
