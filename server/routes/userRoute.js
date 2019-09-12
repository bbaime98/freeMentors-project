import express from 'express';
import signupValidater from '../middleware/signup';
import signinValidater from '../middleware/login';
import UserControllers from '../controllers/UsersController';
import auth from '../helpers/auth';
import allusers from '../controllers/getallusers';

const route = express.Router();

route.get('/api/v2/users', auth, allusers)

route.post('/api/v2/auth/signup', signupValidater, UserControllers.signup);

route.post('/api/v2/auth/signin', signinValidater, UserControllers.signin);



export default route;