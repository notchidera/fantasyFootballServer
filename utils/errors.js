//// CLASS THAT EXTENDS THE ERROR CLASS ADDING SOME INFO
export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;
		////ADDS STACK PROPERTY TO THE ERROR OBJECT
		Error.captureStackTrace(this, this.constructor);
	}
}
export default AppError;
