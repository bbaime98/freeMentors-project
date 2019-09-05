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
    };
    static rejectSession(req, res) {

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                errror: "Please check the ID You enter it must be a valid"
            })
        }

        if (!req.user.is_mentor) {
            return res.status(405).json({
                status: 405,
                error: "Only a mentor can perform this action"
            })
        }

        const session = sessions.find(sessionof => sessionof.sessionId === parseInt(req.params.id));

        if (!session) {
            return res.status(404).json({
                status: 404,
                error: "Session not Found"
            })
        }
        
        if(parseInt(session.mentorId) !== req.user.id){
                return res.status(403).json({
                    status: 403,
                    error: "Can not reject session which is not yours"
                })
        }
        
        session.status = "rejected"

        res.status(200).json({
            status: 200,
            data: session
        })
    };
  
    static acceptSsession(req, res) {

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                errror: "Please  enter valid session ID"
            })
        }

        if (!req.user.is_mentor) {
            return res.status(403).json({
                status: 403,
                error: "Only a mentor can perform this action"
            })
        }

        const session = sessions.find(sessionof => sessionof.sessionId === parseInt(req.params.id));

        if (!session) {
            return res.status(404).json({
                status: 404,
                error: "Session not Found"
            })
        }

        if(  req.user.id !== parseInt(session.mentorId)){
            return res.status(403).json({
                status: 403,
                error: "Can not Accept session which is not yours"
            })
    }


        session.status = "accepted"

        res.status(200).json({
            status: 200,
            error: session
        })
    };



}
