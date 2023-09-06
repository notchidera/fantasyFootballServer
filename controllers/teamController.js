import { Team } from '../models/teamModel.js';

export class TeamController {
	static async index(req, res, next) {
		try {
			const data = await Team.aggregate([
				{ $match: { userId: req.user._id } },
				{
					$lookup: {
						from: 'players',
						localField: 'players',
						foreignField: '_id',
						as: 'players',
					},
				},
			]);
			res.status(200).json({ data });
		} catch (err) {
			next(err);
		}
	}
	static async filterTeam(req, res) {
		const data = await Team.find({ ...req.body.lte });
	}
	static async store(req, res, next) {
		try {
			const newTeam = new Team({ ...req.body, userId: req.user._id });
			const data = await newTeam.save();
			res.status(201).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async update(req, res, next) {
		try {
			const { id } = req.params;
			const data = await Team.findByIdAndUpdate(id, req.body, { new: true });
			res.status(200).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async destroy(req, res, next) {
		try {
			const { id } = req.params;
			const resp = await Team.findByIdAndDelete(id);
			res.status(200).json(resp);
		} catch (err) {
			next(err);
		}
	}
}
