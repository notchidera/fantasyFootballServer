import mongoose from 'mongoose';
/// FUNCTION THAT CONNECTS TO THE DB, URI AND PASSWORD ARE ENV VARIABLES
const connectDb = () => {
	const connUrl =
		process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
			? process.env.DBURL.replace('<password>', process.env.PASSWORD)
			: 'mongodb://localhost:27017';

	//const connUrl = process.env.DBURL.replace('<password>', process.env.PASSWORD);
	console.log(connUrl);
	mongoose
		.connect(connUrl, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then(() => console.log('db connected ' + process.env.NODE_ENV))
		.catch((err) => console.log(err));
};

export default connectDb;
