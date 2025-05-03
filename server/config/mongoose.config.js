import { connect } from 'mongoose';

async function dbConnect() {
    try {
        await connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log(`Pinged your deployment. You successfully connected to MongoDB! ${process.env.DB_NAME}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default dbConnect;

