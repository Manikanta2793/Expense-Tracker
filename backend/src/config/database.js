import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDb = async () => {

    try {
        const mongoDbUrl = process.env.MONGO_URI;
        await mongoose.connect(mongoDbUrl);
        console.log("Database Connected Successfully");





    }
    catch (error) {
        console.log(error);
        process.exit(1)
    }
}
export default ConnectDb;




