import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playersRouter from './routers/playersRouter.js';
import usersRouter from './routers/usersRouter.js';
import teamsRouter from './routers/teamsRouter.js';
import { AppError } from './utilities.js';
import { ErrorController } from './controllers/errorController.js';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();
/// CHANGES FRONTEND URL FOR CORS POLICY BASED ON ENVIROMENT
export const frontEndUrl =
	process.env.NODE_ENV === 'production'
		? 'https://fantasquadbuilder.onrender.com'
		: 'http://localhost:3000';

/// GETS ACCESS TO ENVIROMENT VARIABLES
dotenv.config({ path: './config.env' });
///MIDDLEWARES

app.use(cors({ credentials: true, origin: frontEndUrl }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
/// ROUTES CONFIGURATION MIDDLEWARES
app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/users', usersRouter);
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
/// GLOBAL ERRORHANDLER MIDDLEWARE
app.use(ErrorController.globalErrorHandler);

app.listen(process.env.PORT);

connectDb();
