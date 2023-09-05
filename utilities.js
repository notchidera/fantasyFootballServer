import nodemailer from 'nodemailer';

export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export const sendEmail = async (options) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: 'Vito Russo <test@vito.it>',
			to: options.email,
			subject: options.subject,
			text: options.message,
		};

		transporter.sendMail(mailOptions);
	} catch (err) {
		console.log(err);
	}
};
