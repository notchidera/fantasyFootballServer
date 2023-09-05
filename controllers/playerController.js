import { Player } from '../models/playerModel.js';

export class PlayerController {
	static async index(req, res, bext) {
		try {
			const data = await Player.find({ userId: req.user._id });
			console.log('here');
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
	// static async filterPlayer(req, res) {
	// 	const data = await User.find({ ...req.body.lte });
	// }

	static async store(req, res, next) {
		console.log(req.body);

		try {
			req.body.forEach(async (player) => {
				const oldPlayer = await Player.findOne({
					userId: req.user._id,
					Id: player.Id,
				});
				if (!oldPlayer)
					await Player.create({
						name: player.Nome,
						initialQuote: player['Qt.I'],
						currentQuote: player['Qt.A'],
						value: player.FVM,
						Id: player.Id,
						position: player.R,
						pricePrediction: player.FVM / 1000,
						team: player.Squadra,
						userId: req.user._id,
					});
				else
					await Player.findByIdAndUpdate(oldPlayer._id, {
						initialQuote: player['Qt.I'],
						currentQuote: player['Qt.A'],
						value: player.FVM,
						Id: player.Id,
						position: player.R,
						team: player.Squadra,
					});
			});
			const newPlayersIds = req.body.map((player) => player.Id);
			const oldPlayers = await Player.find({ userId: req.user._id });
			oldPlayers.forEach(async (player) => {
				if (!newPlayersIds.includes(player.Id))
					await Player.findByIdAndDelete(player._id);
			});

			res.status(201).json({ status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async update(req, res, next) {
		try {
			const { id } = req.params;

			const data = await Player.findByIdAndUpdate(id, req.body, { new: true });
			console.log(req.body);
			res.status(200).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async destroy(req, res, next) {
		try {
			const { id } = req.params;
			const resp = await Player.findByIdAndDelete(id);
			res.status(200).json(resp);
		} catch (err) {
			next(err);
		}
	}
}
