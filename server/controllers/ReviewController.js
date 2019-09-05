import sessions from '../models/sessions';
import reviewed from '../models/reviewed';
import users from '../models/users';

export default class ReviewController {

    static reviewMentor(req, res) {
        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                error: " Enter a valid session ID "
            })
        }


        const user = users.find(userof => userof.id === req.user.id)
        if (!user) {
            return res.status(404).json({
                status: 404,
                error: "User not found"
            })
        }

        const session = sessions.find(sessionof => sessionof.sessionId === parseInt(req.params.id));

        if (!session) {
            return res.status(404).json({
                status: 404,
                error: "Session not found"
            })
        }

        if (req.user.id === session.mentorId) {
            return res.status(403).json({
                status: 403,
                error: "You can't review yourself"
            })
        }

        if ( session.status !== 'accepted'){
            return res.status(400).json({
                status: 400,
                error: "your session is not accepted "
            })
        }
        res.status(200).json({
            status: 200,
            message: "Review successfuly posted",
            data: {
                sessionId: session.sessionId,
                mentorId: session.mentorId,
                menteeId: session.menteeId,
                Score: req.body.Score,
                menteeFullName: `${user.first_name} ${user.last_name}`,
                remark: req.body.Remark
            }
        })
        reviewed.push({
            sessionId: session.sessionId,
            mentorId: session.mentorId,
            menteeId: session.menteeId,
            Score: req.body.Score,
            menteeFullName: `${user.first_name}  ${user.last_name}`,
            remark: req.body.Remark
        }) ; 
    }

   
}
