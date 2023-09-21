import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { isValidPassword } from 'mongoose-custom-validators';
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Occorre inserire un indirizzo email'],
			unique: [true, 'Indirizzo email già esistente'],
			lowercase: true,
			validate: [
				validator.isEmail,
				'Occorre inserire un indirizzo email valido',
			],
		},
		password: {
			type: String,
			required: [true, 'Occorre inserire una password'],
			minlength: [10, 'La password deve contenere almeno 10 caratteri'],
			select: false,
			validate: {
				validator: isValidPassword,
				message:
					'La tua password deve avere almeno: 1 lettera maiuscola, 1 lettera minuscola, 1 numero e un carattere speciale',
			},
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Per favore conferma la tua password'],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: 'Le due password devono essere identiche',
			},
		},
		budget: { type: Number, default: 500 },
		players: { type: Number, default: 10 },
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{ timestamps: true }
);

/// Only run this function if password has been modified

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

/// MIDDLEWARE THAT UPDATES THE PASSWORDCHANGEDAT PROPERTY

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	return next();
});

/// ADDS AN INSTANCE METHOD THAT CHECKS FOR PASSWORDS EQUALITY

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

/// ADDS AN INSTANCE METHOD THAT CHECKS IF PASSWORD HAS BEEN CHANGED SINCE THE TOKEN HAS BEEN ISSUED
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

export const User = mongoose.model('user', userSchema, 'users');
