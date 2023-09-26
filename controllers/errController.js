export class ErrController {
	/// GLOBAL MIDDLWARE, IF AN ERROR IS PASSED BY A MIDDLEWARE, THIS MIDDLEWARE SENDS IT TO THE CLIENT WITH SOME INFO (IF PROVIDED)
	static globalErrorHandler = (err, req, res, next) => {
		err.statusCode = err.statusCode || 500;
		err.status = err.status || 'error';
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			statusCode: err.statusCode,
		});
	};
}
