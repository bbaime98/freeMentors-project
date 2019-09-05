import express from 'express';
import signupValidater from '../middleware/signup';
import signinValidater from '../middleware/login';
import UserControllers from '../controllers/UsersController';
import auth from '../helpers/auth';
import allusers from '../controllers/getallusers';

const route = express.Router();

route.get('/api/v1/users',auth,allusers)

route.post('/api/v1/auth/signup',signupValidater,UserControllers.signup);

route.post('/api/v1/auth/signin',signinValidater,UserControllers.signin);



export default route ;