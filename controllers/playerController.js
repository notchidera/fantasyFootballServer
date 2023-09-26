import { Player } from '../models/playerModel.js';

export class PlayerController {
	/// GETS ALL THE PLAYERS FOR A CERTAIN USER, TAKING USER ID FROM THE JWT TOKEN
	static async index(req, res, next) {
		try {
			const data = await Player.find({ userId: req.user._id });
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
	/// SAVE NEW PLAYERS AFTER A FILE UPLOAD
	static async store(req, res, next) {
		try {
			///ITERATES OVER THE PLAYERS LIST IN ORDER TO FIND ALREADY EXISTING PLAYERS BY MATCHING player.Id (PROVIDED BY FANTACALCIO.IT) AND user._id
			req.body.forEach(async (player) => {
				const oldPlayer = await Player.findOne({
					userId: req.user._id,
					Id: player.Id,
				});
				/// IF THE PLAYER DOESN'T EXIST, IT CREATES A NEW ONE, SETTING ALL THE PROPERTIES. PRICEPREDICTION IS SAVED AS AN ABSOLUTE VALUE, USER ID IS ALSO SAVD
				if (!oldPlayer)
					await Player.create({
						name: player.Nome,
						initialQuote: player.initialQuote,
						currentQuote: player.currentQuote,
						value: player.FVM,
						Id: player.Id,
						position: player.R,
						pricePrediction: player.FVM / 1000,
						team: player.Squadra,
						userId: req.user._id,
					});
				/// IF THE PLAYER EXISTS, IT FINDS IT AND UPDATE IT WITH NEW INFO, IF NECESSARY
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
			/// ARRAY OF IDs OF NEW PLAYERS
			const newPlayersIds = req.body.map((player) => player.Id);
			/// GETS ALL EXISTING PLAYERS FOR THE CURRENT USER
			const oldPlayers = await Player.find({ userId: req.user._id });
			/// CHECKS IF IN THE NEW PLAYERS ARRAY SOME PLAYER ARE MISSING AND DESTROYS THEM
			oldPlayers.forEach(async (player) => {
				if (!newPlayersIds.includes(player.Id))
					await Player.findByIdAndDelete(player._id);
			});

			res.status(201).json({ status: 'ok' });
		} catch (err) {
			next(err);
		}
	}
	/// UPDATES A PLAYER
	static async update(req, res, next) {
		try {
			const { id } = req.params;

			const data = await Player.findByIdAndUpdate(id, req.body, { new: true });
			res.status(200).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}
	/// DELETES A PLAYER
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
