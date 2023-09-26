import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		initialQuote: Number,
		currentQuote: Number,
		value: { type: Number, required: true },
		Id: { type: Number, required: true },
		position: { type: String, required: true },
		pricePrevYear: Number,
		pricePrediction: Number,
		maxBidPrice: Number,
		team: { type: String, required: true },
		userId: { type: mongoose.Schema.ObjectId, required: true },
	},
	{ timestamps: true }
);

export const Player = mongoose.model('player', playerSchema, 'players');
