import mongoose from 'mongoose';
/// FUNCTION THAT CONNECTS TO THE DB, URI AND PASSWORD ARE ENV VARIABLES
const connectDb = () => {
	const connUrl = process.env.DBURL.replace('<password>', process.env.PASSWORD);

	mongoose
		.connect(connUrl, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then(() => console.log('db connected'))
		.catch((err) => console.log(err));
};

export default connectDb;
