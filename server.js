import http from 'http';
import app from './server/app';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(app);

const port = process.env.PORT || 2000;

app.listen(port,()=>{
    console.log(`you are running port ${port}....`)
});