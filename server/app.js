import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import mentorsRoute from './routes/mentorsRoute';
import sessionRoute from './routes/sessionRoute';
import reviewRoute from './routes/reviewRoute';

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',sessionRoute);
app.use('/',userRoute);
app.use('/',mentorsRoute);
app.use('/', reviewRoute);

export default app;