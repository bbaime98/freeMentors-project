import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import mentorsRoute from './routes/mentorsRoute';
import sessionRoute from './routes/sessionRoute';


const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',sessionRoute);
app.use('/',userRoute);
app.use('/',mentorsRoute);


export default app;