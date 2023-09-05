import { User } from '../models/userModel.js';
import { AppError } from '../utilities.js';

export class UserController {
	static async index(req, res, next) {
		try {
			const data = await User.find();
			res.status(200).json({ data });
		} catch (err) {
			next(err);
		}
	}

	static async show(req, res, next) {
		try {
			const respObj = await User.findOne(req.user._id);
			res.status(200).json({ data: respObj, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async store(req, res, next) {
		try {
			const newUser = new User(req.body);
			const data = await newUser.save();
			res.status(201).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async update(req, res, next) {
		try {
			const data = await User.findByIdAndUpdate(req.user._id, req.body, {
				new: true,
			});
			res.status(200).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	static async destroy(req, res, next) {
		try {
			const { id } = req.params;
			console.log(id);
			const resp = await User.findByIdAndDelete(id);
			res.status(200).json(resp);
		} catch (err) {
			next(err);
		}
	}
}
