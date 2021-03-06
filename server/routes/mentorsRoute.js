import express from 'express';
import auth from '../helpers/auth';
import MentorsController from '../controllers/MentorController';


const route = express.Router();

route.get('/api/v2/mentors/:id', auth, MentorsController.specificMentor)

route.get('/api/v2/mentors', auth, MentorsController.allMentors);

route.patch('/api/v2/user/:id', auth, MentorsController.changeUSer);


export default route;