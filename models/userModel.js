import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { isValidPassword } from 'mongoose-custom-validators';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please provide an email address'],
			unique: [true, 'Email address already exists'],
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email address'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: [10, 'Password must be at least 10 characters long'],
			select: false,
			validate: {
				validator: isValidPassword,
				message: 'Password must include uppercase, lowercase, numbers, and special characters',
			},
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords must match',
			},
		},
		budget: { type: Number, default: 10000 }, // Updated default budget
		userScore: { type: Number, default: 0 }, // Tracks cumulative points across leagues
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{ timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

// Middleware to update passwordChangedAt property
userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	return next();
});

// Method to check password correctness
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if password has changed since token issue
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

// Method to create a password reset token
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
