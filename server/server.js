import express from 'express';
const server = express();
import dotenv from 'dotenv';
import cors from 'cors';
import { corsOptions, errorHndler,ssl_options } from './utils/index.util.js';
import routes from './routes/index.route.js';
import connect from './utils/db.util.js';
import https from 'https';
import http from 'http';
let app = undefined;
dotenv.config();

// Create an HTTP OR HTTPS server
if(process.env.USE_SERVER_SSL == 'true'){
    app = https.createServer(ssl_options, server);
}else{
    app = http.createServer(server);
}

//handle incomming requests and parse the body of the request to json format and url encoded format.
server.use(cors(corsOptions));
server.options('*', cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api',routes);
server.use(errorHndler);

server.get('/',(req,res)=>{
    res.redirect('https://www.bytecodes.me');
});

const startServer = async () => {
    try {
        await connect();
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server started on ${process.env.SERVER_PORT}`);
        });
    } catch (error) {
        console.log('Server failed to start');
        console.log(error.message);
    }
}

await startServer();