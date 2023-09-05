export class ErrorController {
	static globalErrorHandler = (err, req, res, next) => {
		err.statusCode = err.statusCode || 500;
		err.status = err.status || 'error';
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			statusCode: err.statusCode,
		});
	};

	static async catchAsync(fn) {
		return (req, res, next) => {
			fn(req, res, next).catch(next);
		};
	}
}
