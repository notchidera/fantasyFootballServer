// leagueModel.js
import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['public', 'private'], default: 'public' },
    participants: [{ type: mongoose.Schema.ObjectId, ref: 'user' }], // Users in the league
    entryFee: { type: Number, default: 0 }, // Optional entry fee
    prizePool: { type: Number, default: 0 }, // Total prize pool for public leagues
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'user' }, // User who created the league
    createdAt: { type: Date, default: Date.now },
});

export const League = mongoose.model('league', leagueSchema, 'leagues');

