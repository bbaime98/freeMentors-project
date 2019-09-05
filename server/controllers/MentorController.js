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
    };
    static   specificMentor(req, res) {

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                error: "Please enter a  valid ID"
            })
        }

        const allmentors = users.filter(userof => userof.is_mentor === true);

        const mentor = allmentors.find(userof => userof.id === parseInt(req.params.id));

        if (!mentor) {
            return res.status(404).json({
                status: 404,
                error: "Mentor not found"
            })
        }
        users.forEach((user => delete user.is_admin));
        users.forEach((user => delete user.password));
        res.status(200).json({
            status: 200,
            data: mentor
        })
    }

}
