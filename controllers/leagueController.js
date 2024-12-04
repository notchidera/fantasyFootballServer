import { League } from '../models/leagueModel.js';
import { User } from '../models/userModel.js';
import Email from '../utils/email.js';
import { AppError } from '../utils/errors.js';

export class LeagueController {
    /// GET ALL LEAGUES
    static async index(req, res, next) {
        try {
            const leagues = await League.find().populate('participants', 'email');
            res.status(200).json({ status: 'success', data: leagues });
        } catch (err) {
            next(err);
        }
    }

    /// CREATE A NEW LEAGUE
    static async store(req, res, next) {
        try {
            const { name, type, entryFee, prizePool } = req.body;

            const newLeague = await League.create({
                name,
                type,
                entryFee,
                prizePool,
                createdBy: req.user._id,
            });

            // Send confirmation email to the league creator
            const user = await User.findById(req.user._id);
            const email = new Email(user, `${process.env.FRONTEND_URL}/leagues/${newLeague._id}`);
            await email.sendLeagueCreationConfirmation(newLeague.name);

            res.status(201).json({ status: 'success', data: newLeague });
        } catch (err) {
            next(err);
        }
    }

    /// SHOW DETAILS OF A LEAGUE
    static async show(req, res, next) {
        try {
            const league = await League.findById(req.params.id).populate('participants', 'email userScore');
            if (!league) {
                return next(new AppError('League not found', 404));
            }
            res.status(200).json({ status: 'success', data: league });
        } catch (err) {
            next(err);
        }
    }

    /// DELETE A LEAGUE
    static async destroy(req, res, next) {
        try {
            const league = await League.findById(req.params.id);
            if (!league) {
                return next(new AppError('League not found', 404));
            }

            // Ensure only the creator can delete the league
            if (league.createdBy.toString() !== req.user._id.toString()) {
                return next(new AppError('You do not have permission to delete this league', 403));
            }

            await league.remove();
            res.status(200).json({ status: 'success', message: 'League deleted' });
        } catch (err) {
            next(err);
        }
    }

    /// JOIN A LEAGUE
    static async join(req, res, next) {
        try {
            const league = await League.findById(req.params.id);
            if (!league) {
                return next(new AppError('League not found', 404));
            }

            // Check if user is already a participant
            if (league.participants.includes(req.user._id)) {
                return next(new AppError('You are already a participant in this league', 400));
            }

            // Add the user to the league
            league.participants.push(req.user._id);
            league.prizePool += league.entryFee || 0; // Update prize pool if entry fee exists
            await league.save();

            // Send an email to the user confirming their participation
            const user = await User.findById(req.user._id);
            const email = new Email(user, `${process.env.FRONTEND_URL}/leagues/${league._id}`);
            await email.sendLeagueInvite(league.name);

            res.status(200).json({ status: 'success', message: 'Successfully joined the league', data: league });
        } catch (err) {
            next(err);
        }
    }

    /// NOTIFY USERS OF THEIR STANDINGS
    static async notifyStandings(req, res, next) {
        try {
            const league = await League.findById(req.params.id).populate('participants', 'email userScore');
            if (!league) {
                return next(new AppError('League not found', 404));
            }

            // Notify each participant of their current standings
            const sortedParticipants = league.participants.sort((a, b) => b.userScore - a.userScore);

            for (let i = 0; i < sortedParticipants.length; i++) {
                const user = sortedParticipants[i];
                const email = new Email(user, `${process.env.FRONTEND_URL}/leagues/${league._id}`);
                await email.sendStandingsNotification(league.name, i + 1);
            }

            res.status(200).json({ status: 'success', message: 'Standings notifications sent' });
        } catch (err) {
            next(err);
        }
    }
}
