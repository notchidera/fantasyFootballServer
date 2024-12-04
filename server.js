import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import stocksRouter from './routers/stocksRouter.js';
import usersRouter from './routers/usersRouter.js';
import portfoliosRouter from './routers/portfoliosRouter.js';
import leaguesRouter from './routers/leaguesRouter.js';
import { AppError } from './utils/errors.js';
import { ErrController } from './controllers/errController.js';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();

/// CHANGE FRONTEND URL FOR CORS POLICY BASED ON ENVIRONMENT
export const frontEndUrl =
	process.env.NODE_ENV === 'production'
		? 'https://fantasquadbuilder.onrender.com'
		: 'http://localhost:3000';

/// GET ACCESS TO ENVIRONMENT VARIABLES
dotenv.config({ path: './config.env' });

/// MIDDLEWARES
// HTTP HEADERS FOR PROTECTION
app.use(helmet());

// SET RATE LIMIT FOR REQUESTS FROM THE SAME IP
const limiter = rateLimit({
	max: 500,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});

app.use(limiter);

// SET CORS POLICY
app.use(cors({ credentials: true, origin: frontEndUrl }));

// BODY PARSERS
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS (CROSS-SITE SCRIPTING)
app.use(xss());

// COOKIE PARSER
app.use(cookieParser());

/// ROUTES CONFIGURATION MIDDLEWARES
app.use('/api/stocks', stocksRouter); // Replaces playersRouter
app.use('/api/portfolios', portfoliosRouter); // Replaces teamsRouter
app.use('/api/users', usersRouter);
app.use('/api/leagues', leaguesRouter);

/// HANDLING UNDEFINED ROUTES
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER MIDDLEWARE
app.use(ErrController.globalErrorHandler);

// START SERVER
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});

// CONNECT TO DATABASE
connectDb();
