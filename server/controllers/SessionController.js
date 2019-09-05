import users from '../models/users';
import sessions from '../models/sessions';

export default class SessionController {

    static createSession(req, res) {

        const allmentors = users.filter(userof => userof.is_mentor === true);

        const mentor = allmentors.find(mentorof => mentorof.id === parseInt(req.body.mentorId));

        if (!mentor) {
            return res.status(404).json({
                status: 404,
                error: "Mentor not found"
            })
        }

        if (req.body.mentorId == req.user.id) {
            return res.status(403).json({
                status: 403,
                error: "Can not request a session to yourself"
            })
        }

        const newSession = {
            sessionId: sessions.length + 1,
            mentorId: parseInt(req.body.mentorId),
            menteeId: req.user.id,
            questions: req.body.questions,
            menteeEmail: req.user.email,
            status: "pending"
        }
        sessions.push(newSession);
        res.status(201).json({
            status: 201,
            message: "Session created sucessfully",
            data: newSession
        })
    }

}
