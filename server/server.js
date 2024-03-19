import express from 'express';
const server = express();
import dotenv from 'dotenv';
import cors from 'cors';
import { corsOptions, errorHndler } from './utils/index.util.js';
import routes from './routes/index.route.js';
import connect from './utils/db.util.js';
dotenv.config();

//handle incomming requests and parse the body of the request to json format and url encoded format.
server.use(cors(corsOptions));
server.options('*', cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api',routes);
server.use(errorHndler);

server.get('/',(req,res)=>{
    res.redirect("www.bytecodes.me");
});

const startServer = async () => {
    try {
        await connect();
        server.listen(process.env.SERVER_PORT, () => {
            console.log(`Server started on ${process.env.SERVER_PORT}`);
        });
    } catch (error) {
        console.log('Server failed to start');
        console.log(error.message);
    }
}

await startServer();