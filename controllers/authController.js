import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { AppError } from '../utilities.js';
import { sendEmail } from '../utilities.js';

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		domain: 'onrender.com',
		secure: true,
		httpOnly: true,
		sameSite: 'none',
	};
	user.password = undefined;

	res.cookie('jwt', token, cookieOptions).status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export class AuthController {
	static async signup(req, res, next) {
		try {
			const { email, password, passwordConfirm, budget } = req.body;
			const newUser = await User.create({
				email,
				password,
				passwordConfirm,
			});
			createSendToken(newUser, 201, res);
		} catch (err) {
			next(err);
		}
	}
	static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return next(new AppError('Please provide email and password', 400));
			}

			const user = await User.findOne({ email }).select('+password');
			if (!user || !(await user.correctPassword(password, user.password))) {
				return next(new AppError('Incorrect email or password', 401));
			}

			createSendToken(user, 200, res);
		} catch (err) {
			next(err);
		}
	}

	static async logout(req, res) {
		res.cookie('jwt', '', { httpOnly: true });
		res.status(200).json({ status: 'success' });
	}

	static async protect(req, res, next) {
		try {
			// 	CHECK IF JWT TOKEN EXISTS
			let token = req.cookies.jwt;

			if (!token) {
				return next(
					new AppError(
						'You are not logged in! Please log in to get accesss',
						401
					)
				);
			}
			try {
				/// VERIFY JWT TOKEN
				const decoded = await promisify(jwt.verify)(
					token,
					process.env.JWT_SECRET
				);
				/// CHECK IF THE USER STILL EXISTS
				const freshUser = await User.findById(decoded.id);
				if (!freshUser) {
					return next(new AppError('The user no longer exists', 401));
				}
				// CHECK IF USER CHANGED PASSWORD
				if (freshUser.changedPasswordAfter(decoded.iat)) {
					return next(
						new AppError(
							'User recently changed password, please log in again',
							401
						)
					);
				}
				req.user = freshUser;
				return next();
			} catch (err) {
				return next(new AppError('Invalid token. Please log in again', 401));
			}
		} catch (err) {
			return next(err);
		}
	}
	static async forgotPassword(req, res) {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return next(
				new AppError('There is no user with that email address', 404)
			);

		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });

		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/api/users/resetPassword/${resetToken}`;

		const message = `Forgot your password? Submit a patch request with yout new password and passwordConfirm to ${resetURL}`;
		try {
			await sendEmail({
				email: user.email,
				subject: 'Your password reset token (valid for 10 min)',
				message,
			});

			res.status(200).json({
				status: 'success',
				kessage: 'Token sent to email',
			});
		} catch (err) {
			user.passworResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			return next(
				new AppError(
					'There was an error sending the email. Try again later',
					500
				)
			);
		}
	}
	static async resetPassword(req, res) {}
}
