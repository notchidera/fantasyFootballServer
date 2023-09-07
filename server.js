import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playersRouter from './routers/playersRouter.js';
import usersRouter from './routers/usersRouter.js';
import teamsRouter from './routers/teamsRouter.js';
import fileUpload from 'express-fileupload';
import { AppError } from './utilities.js';
import { ErrorController } from './controllers/errorController.js';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();
export const frontEndUrl =
	process.env.NODE_ENV === 'production'
		? 'https://fantasquadbuilder.onrender.com'
		: 'http://localhost:3000';

dotenv.config({ path: './config/config.env' });

app.use(cors({ credentials: true, origin: frontEndUrl }));

// app.use(
// 	fileUpload({
// 		useTempFiles: true,
// 		safeFileNames: true,
// 		preserveExtension: false,
// 		tempFileDir: `./public/files/temp`,
// 	})
// );
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(ErrorController.globalErrorHandler);

app.listen(process.env.PORT);

connectDb();
