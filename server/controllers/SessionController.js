import users from '../models/users';
import sessions from '../models/sessions';
import db from '../../database/database';
export default class SessionController {

static async createSession(req, res) {
    
    const { mentorId, questions } = req.body;
    const { id:menteeId, email:menteeEmail } = req.user;

     const fetchMentor = `
        SELECT * FROM user_table
       WHERE  id= ${ req.body.mentorId} 
        `;
        try {
             const {rows} =  await db.pool.query(fetchMentor)
           
                if (!rows){
                 return  res.status(404).json({
                        status: 404,
                        data: "Mentor not found"
                   })
                }
                
        } catch (error) {
            return res.status(500).json({
                    status: 500,
                    error
                });
        }
    const existingSession =  `
        SELECT * FROM sessions
       WHERE  mentorID = ${mentorId} AND menteeID = ${menteeId}
        `;
       
    try {
    const {rows} =  await db.pool.query(existingSession)          
                if (rows.length > 0 ){
                 return  res.status(404).json({
                        status: 404,
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
        await db.pool.query(createSession, newSession)
        .then((response) => {
            
          return  res.status(200).json({
                status: 200,
                data: response.rows
                
            })
        })
        .catch((error) => {
            console.log(error);
            
           return res.status(500).json({
                status: 500,
                error
            });
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
  
    static async acceptSsession(req, res) {
        console.log('mentorrrr', req.user);
        if(!req.user.is_mentor){
            return res.status(403).json({
                            status: 403,
                            data: "Only mentors can perform this action"
                       })
        }
         const fetchSession = `
            SELECT * FROM sessions
           WHERE  sessionid= '${req.params.id}' AND mentorid = '${req.user.id}'
            `;
            console.log('fectsession....', req.params.id)
            try {
                const {rows} =  await db.pool.query(fetchSession)
                console.log('rows...',rows)
                    if (!rows){
                        
                     return  res.status(404).json({
                            status: 404,
                            data: "Session was not found"
                       })
                    }
                    
            } catch (error) {
                console.log('accept session error',error)
                return res.status(500).json({
                        status: 500,
                        error
                    });
            }
        const updateStatus =  `
            UPDATE sessions SET status ='Accepted'
           WHERE  sessionid = '${req.params.id}'
           returning *
            `;        
        try {
        const {rows} =  await db.pool.query(updateStatus)       
        console.log('update status.....',rows )
                    if (rows){
                     return  res.status(200).json({
                            status: 200,
                            message: 'Session is Accepted',
                            data: rows
                       })
                    }
                    
            } catch (error) {
                console.log('erroroor',error);
                return res.status(500).json({
                        status: 500,
                        error
                    });
            }
    
        
    };


    static mentorAllSession(req, res) {
        if (req.user.is_mentor) {

            const mentorSession = sessions.filter(sessionsof => sessionsof.mentorId === req.user.id);

            if (!mentorSession) {
                return res.status(404).json({
                    status: 404,
                    error: "No sessions found for the user"
                })
            }
            return res.status(200).json({
                status: 200,
                data: mentorSession
            })
        }
        else {
            const mySessions = sessions.filter(sessionsof => sessionsof.menteeId === req.user.id);

            if (!mySessions) {
                return res.status(404).json({
                    status: 404,
                    error: "No sessions found for the user"
                })
            }
            res.status(200).json({
                status: 200,
                data: mySessions
            });
        }
    };


}