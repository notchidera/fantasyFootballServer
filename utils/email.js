import nodemailer from 'nodemailer';

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.url = url;
		this.from = 'Vito <vito.fantasquadbuilder.com>';
	}
	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return;
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}
	async send(subject, text) {
		/// render HTML template

		/// DEFINE EMAIL OPTIONS
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text,
		};

		///CREATE TRANSPORT AND SEND EMAIL
		await this.newTransport().sendMail(mailOptions);
	}
	async sendReset(message) {
		await this.send('Reimposta la tua password', message);
	}
}

export default Email;
