import express from 'express';
import auth from '../helpers/auth';
import createSessionValidator from '../middleware/createSession'; 
import SessionController from '../controllers/SessionController';


const route = express.Router();

route.get('/api/v1/sessions', auth , SessionController.mentorAllSession);

route.patch('/api/v1/sessions/:id/reject', auth, SessionController.rejectSession);

route.patch('/api/v1/sessions/:id/accept', auth, SessionController.acceptSsession);

route.post('/api/v1/sessions', auth, createSessionValidator, SessionController.createSession)

export default route;