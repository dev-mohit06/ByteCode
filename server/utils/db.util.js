import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let dbInstance = null;

const connect = async () => {
    try {
        dbInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName : process.env.DB_NAME,
            autoIndex : true,
        });
        console.log('Database connected');
    } catch (error) {
        console.log('Database connection failed');
        console.log(error.message);
    }
}

const getDbInstance = async () => {
    if (!dbInstance) {
        await connect();
    }
    return dbInstance;
}

export { getDbInstance };
export default connect;