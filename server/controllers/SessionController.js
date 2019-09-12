import users from '../models/users';
import sessions from '../models/sessions';
import db from '../../database/database';
export default class SessionController {

    static async createSession(req, res) {

        const { mentorId, questions } = req.body;
        const { id: menteeId, email: menteeEmail } = req.user;

        const fetchMentor = `
        SELECT * FROM user_table
       WHERE  id= ${ req.body.mentorId} 
        `;

        try {
            const { rows } = await db.pool.query(fetchMentor)
 
            if (!rows[0]) {
                return res.status(404).json({
                    status: 404,
                    data: {
                        mesaage: "Mentor not found"
                    }
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 500,
                error
            });
        }
        const existingSession = `
        SELECT * FROM sessions
       WHERE  mentorID = ${mentorId} AND menteeID = ${menteeId}
        `;

        try {
            const { rows } = await db.pool.query(existingSession)
          
            for (let i = 0 ; i<rows.length ; i++)   
            if (rows[i].mentorid == mentorId & rows[i].questions == questions) {
                 
                    return res.status(400).json({
                        status: 400,
                        data: "Session already exist"
                    })
                }

        } catch (error) {
            return res.status(500).json({
                status: 500,
                error
            });
        }

        const newSession = [mentorId, menteeId, questions, menteeEmail];

        const createSession = `
        INSERT INTO sessions(mentorId, menteeId, questions, menteeEmail)
        VALUES($1, $2, $3, $4)  
        returning sessionId,mentorId, menteeId, questions, menteeEmail, status
        `;
        db.pool.query(createSession, newSession)
            .then((response) => {

                return res.status(200).json({
                    status: 200,


                    mesaage: 'Session created successfully',

                    data: response.rows

                })
            })
            .catch((error) => {


                return res.status(500).json({
                    status: 500,
                    error
                });
            })

    };

    static  acceptSsession(req, res) {
        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                errror: "Please check the ID You enter it must be a valid"
            })
        }
        if (!req.user.is_mentor) {
            return res.status(403).json({
                status: 403,
                data: "Only mentors can perform this action"
            })
        }
        const fetchSession = `
            SELECT * FROM sessions
           WHERE  sessionid= '${req.params.id}' AND mentorid = '${req.user.id}'
            `;
        const updateStatus = `
            UPDATE sessions SET status ='Accepted'
           WHERE  sessionid = '${req.params.id}'
           returning *
            `;
         db.pool.query(fetchSession)
            .then(({ rows }) => {
                
                if (!rows[0]) {
                    return res.status(404).json({
                        status: 404,
                        data: {
                            massage: "Session was not found"
                        }
                    })
                }
                if (rows[0].status === 'Accepted') {
                    return res.status(400).json({
                        status: 400,
                        data: {
                            massage: "Session is already accepted"
                        }
                    })
                }
                db.pool.query(updateStatus)
                    .then(({ rows }) => {
                        return res.status(200).json({
                            status: 200,
                            message: 'Session is Accepted',
                            data: rows
                        })
                            .catch((error) => {
                                return res.status(500).json({
                                    status: 500,
                                    error
                                });
                            })
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            status: 500,
                            error
                        });
                    })
            })

    };


    static  rejectSession(req, res) {
        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                errror: "Please check the ID You enter it must be a valid"
            })
        }
        if (!req.user.is_mentor) {
            return res.status(403).json({
                status: 403,
                data: "Only mentors can perform this action"
            })
        }
        const fetchSession = `
                SELECT * FROM sessions
               WHERE  sessionid= '${req.params.id}' AND mentorid = '${req.user.id}'
                `;
        const updateStatus = `
                UPDATE sessions SET status ='Rejected'
               WHERE  sessionid = '${req.params.id}'
               returning *
                `;
         db.pool.query(fetchSession)
            .then(({ rows }) => {
                if (!rows[0]) {
                    return res.status(404).json({
                        status: 404,
                        data: {
                            massage: "Session was not found"
                        }
                    })
                }
                if (rows[0].status === 'Rejected') {
                    return res.status(400).json({
                        status: 400,
                        data: {
                            massage: "Session is Rejected already "
                        }
                    })
                }
                db.pool.query(updateStatus)
                    .then(({ rows }) => {
                        return res.status(200).json({
                            status: 200,
                            message: 'Session is Rejected',
                            data: rows
                        })
                            .catch((error) => {
                                return res.status(500).json({
                                    status: 500,
                                    error
                                });
                            })
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            status: 500,
                            error
                        });
                    })
            })

    };



}