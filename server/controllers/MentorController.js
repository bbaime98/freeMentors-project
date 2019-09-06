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
    static specificMentor(req, res) {

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
    };
    static changeUSer(req, res) {

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                error: "Please enter a  valid ID"
            })
        }

        if (!req.user.is_admin) {
            return res.status(403).json({
                status: 403,
                error: "An admin only is allowed to perform this action"
            })
        }

        const user = users.find(userof => userof.id === parseInt(req.params.id))

        if (!user) {
            return res.status(404).json({
                status: 404,
                error: "The user id is not found"
            })
        }

        if (user.is_mentor) {
            return res.status(400).json({
                status: 400,
                error: "The user is already a mentor"
            })
        }

        if (user.is_admin) {
            return res.status(400).json({
                status: 400,
                error: "The user is an admin"
            })
        }
        user.is_mentor = true;

        const token = jwt.sign({
            id: req.user.id,
            is_admin: user.is_admin,
            is_mentor: user.is_mentor,
            email: user.email
        }, process.env.JWTPRIVATEKEY);
        // user instead of users in case down on
        users.forEach((user => delete user.is_admin));
        users.forEach((user => delete user.password));
        res.header('token', token).status(200).json({
            status: 200,
            data: {
                message: "User account changed to mentor",
                user
            }
        });
    }

}
