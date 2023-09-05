import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
	players: [mongoose.Schema.ObjectId],
	userId: { type: mongoose.Schema.ObjectId, required: true },
	name: { type: String, required: true },
});

export const Team = mongoose.model('team', teamSchema, 'teams');
