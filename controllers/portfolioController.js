import { Portfolio } from '../models/portfolioModel.js';
import { Stock } from '../models/stockModel.js';
import { League } from '../models/leagueModel.js';

export class PortfolioController {
    /// GET ALL PORTFOLIOS FOR THE CURRENT USER WITHIN A LEAGUE
    static async index(req, res, next) {
        try {
            const portfolios = await Portfolio.find({
                userId: req.user._id,
                leagueId: req.params.leagueId,
            }).populate('stocks', 'tickerSymbol companyName currentPrice');
            
            res.status(200).json({ status: 'success', data: portfolios });
        } catch (err) {
            next(err);
        }
    }

    /// CREATE A NEW PORTFOLIO FOR A LEAGUE
    static async store(req, res, next) {
        try {
            const { name, leagueId, stocks } = req.body;

            // Ensure league exists
            const league = await League.findById(leagueId);
            if (!league) {
                return res.status(404).json({ status: 'fail', message: 'League not found' });
            }

            // Check if the user is already in the league
            const existingPortfolio = await Portfolio.findOne({
                userId: req.user._id,
                leagueId,
            });
            if (existingPortfolio) {
                return res.status(400).json({ status: 'fail', message: 'Portfolio already exists in this league' });
            }

            const newPortfolio = await Portfolio.create({
                name,
                leagueId,
                userId: req.user._id,
                stocks,
            });

            res.status(201).json({ status: 'success', data: newPortfolio });
        } catch (err) {
            next(err);
        }
    }

    /// UPDATE A PORTFOLIO (E.G., ADD OR REMOVE STOCKS)
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, stocks } = req.body;

            const updatedPortfolio = await Portfolio.findByIdAndUpdate(
                id,
                { name, stocks },
                { new: true }
            ).populate('stocks', 'tickerSymbol companyName currentPrice');

            res.status(200).json({ status: 'success', data: updatedPortfolio });
        } catch (err) {
            next(err);
        }
    }

    /// DELETE A PORTFOLIO
    static async destroy(req, res, next) {
        try {
            const { id } = req.params;
            await Portfolio.findByIdAndDelete(id);
            res.status(200).json({ status: 'success', message: 'Portfolio deleted' });
        } catch (err) {
            next(err);
        }
    }

    /// CALCULATE SCORES FOR PORTFOLIOS IN A LEAGUE
    static async calculateScores(req, res, next) {
        try {
            const portfolios = await Portfolio.find({ leagueId: req.params.leagueId });

            portfolios.forEach(async (portfolio) => {
                let totalScore = 0;

                for (const stockId of portfolio.stocks) {
                    const stock = await Stock.findById(stockId);
                    if (stock) {
                        // Example scoring: +100 points per 1% growth
                        const performance = ((stock.currentPrice - stock.initialPrice) / stock.initialPrice) * 100;
                        totalScore += performance * 100;
                    }
                }

                portfolio.score = totalScore;
                await portfolio.save();
            });

            res.status(200).json({ status: 'success', message: 'Scores calculated' });
        } catch (err) {
            next(err);
        }
    }
}
