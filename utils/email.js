import nodemailer from 'nodemailer';

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        this.from = 'Vito <vito.fantasquadbuilder.com>';
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Add production email service configuration if needed (e.g., SendGrid, SES)
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }
        // Development email configuration
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
        // Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text,
        };

        // Create transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendReset(message) {
        await this.send('Reset Your Password', message);
    }

    // Add league-related email functionalities

    // Send league invitation
    async sendLeagueInvite(leagueName) {
        const subject = `You’ve been invited to join the league: ${leagueName}`;
        const message = `Hello,

You’ve been invited to join the league: ${leagueName}.
Click the link below to join:
${this.url}

Happy betting!
`;
        await this.send(subject, message);
    }

    // Send standings notification
    async sendStandingsNotification(leagueName, position) {
        const subject = `Your standings in ${leagueName}`;
        const message = `Hello,

Your current position in the league ${leagueName} is: ${position}.
Keep up the great work or strategize for a comeback!

Best regards,
Fantasy Stock App Team
`;
        await this.send(subject, message);
    }

    // Notify league creation confirmation
    async sendLeagueCreationConfirmation(leagueName) {
        const subject = `Your league ${leagueName} has been created successfully!`;
        const message = `Hello,

Congratulations! Your league, ${leagueName}, has been created successfully.
Invite your friends to join and start betting on stocks.

Best regards,
Fantasy Stock App Team
`;
        await this.send(subject, message);
    }
}

export default Email;
