import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let dbInstance = null;

const connect = async () => {
    try {
        const DB_URI = process.env.APP_ENV_MODE == 'development' ? process.env.MONGO_DEV_URI : process.env.MONGO_URI;
        dbInstance = await mongoose.connect(DB_URI, {
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