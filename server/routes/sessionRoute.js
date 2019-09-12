import express from 'express';
import auth from '../helpers/auth';
import createSessionValidator from '../middleware/createSession'; 
import SessionController from '../controllers/SessionController';


const route = express.Router();


route.patch('/api/v2/sessions/:id/reject', auth, SessionController.rejectSession);

route.patch('/api/v2/sessions/:id/accept', auth, SessionController.acceptSsession);

route.post('/api/v2/sessions', auth, createSessionValidator, SessionController.createSession)

export default route;