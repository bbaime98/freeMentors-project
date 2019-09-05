import users from '../models/users';
import jwt from 'jsonwebtoken';

 export default class MentorsController {

   static allMentors(req, res) {

        const mentors = users.filter(userof => userof.is_mentor === true);

        if (!mentors) {
            return res.status(404).json({
                status: 404,
                error: "No mentors found"
            })
        }
        
        mentors.forEach((user => delete user.is_admin));
        mentors.forEach((user => delete user.password));
        res.status(200).json({
            status: 200,
            data: mentors
        })
    }

}
