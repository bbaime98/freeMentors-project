import express from 'express';
import auth from '../helpers/auth';
import reviewValidater from '../middleware/review';
import ReviewController from '../controllers/ReviewController';

const route = express.Router();

route.delete('/api/v1/sessions/:id/review', auth, ReviewController.deleteReview);

route.post('/api/v1/sessions/:id/review', auth, reviewValidater,ReviewController.reviewMentor);

export default route;