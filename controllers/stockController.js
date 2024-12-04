import { Stock } from '../models/stockModel.js';

export class StockController {
	/// GETS ALL STOCKS FOR A CERTAIN USER
	static async index(req, res, next) {
		try {
			const data = await Stock.find({ userId: req.user._id });
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}

	/// SAVES NEW STOCKS AFTER A FILE UPLOAD
	static async store(req, res, next) {
		try {
			// Create or update stocks
			req.body.forEach(async (stock) => {
				const existingStock = await Stock.findOne({
					userId: req.user._id,
					tickerSymbol: stock.tickerSymbol,
				});
				// If the stock doesn't exist, create a new entry
				if (!existingStock) {
					await Stock.create({
						tickerSymbol: stock.tickerSymbol,
						companyName: stock.companyName,
						initialPrice: stock.initialPrice,
						currentPrice: stock.currentPrice,
						sector: stock.sector,
						userId: req.user._id,
					});
				} else {
					// Update the existing stock with new information
					await Stock.findByIdAndUpdate(existingStock._id, {
						initialPrice: stock.initialPrice,
						currentPrice: stock.currentPrice,
						sector: stock.sector,
					});
				}
			});

			/// ARRAY OF TICKER SYMBOLS OF NEW STOCKS
			const newStocksSymbols = req.body.map((stock) => stock.tickerSymbol);

			/// GETS ALL EXISTING STOCKS FOR THE CURRENT USER
			const oldStocks = await Stock.find({ userId: req.user._id });

			/// CHECKS IF ANY STOCKS ARE MISSING FROM THE NEW STOCKS ARRAY AND REMOVES THEM
			oldStocks.forEach(async (stock) => {
				if (!newStocksSymbols.includes(stock.tickerSymbol))
					await Stock.findByIdAndDelete(stock._id);
			});

			res.status(201).json({ status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	/// UPDATES A STOCK
	static async update(req, res, next) {
		try {
			const { id } = req.params; // Stock ID from params
			const data = await Stock.findByIdAndUpdate(id, req.body, { new: true });
			res.status(200).json({ data, status: 'ok' });
		} catch (err) {
			next(err);
		}
	}

	/// DELETES A STOCK
	static async destroy(req, res, next) {
		try {
			const { id } = req.params; // Stock ID from params
			const resp = await Stock.findByIdAndDelete(id);
			res.status(200).json(resp);
		} catch (err) {
			next(err);
		}
	}
}
