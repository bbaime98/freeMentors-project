import users from '../models/users';
import jwt from 'jsonwebtoken';
import db from '../../database/database';

export default class MentorsController {

    static  allMentors(req, res) {

        const fetchMentors = `
        SELECT  id,first_name, last_name, email,
            address, bio, occupation, expertise, is_mentor FROM user_table
       WHERE is_mentor= ${ true}

`;
         db.pool.query(fetchMentors)
            .then((response) => {

                res.status(200).json({
                    status: 200,

                    data:

                        response.rows

                })

            })
            .catch((error) => {

                res.status(500).json({
                    status: 500,
                    error
                });
            })
    };

    static specificMentor(req, res) {

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                status: 400,
                error: "Please enter a  valid ID"
            })
        }
        const fetchMentor = `
        SELECT  id,first_name, last_name, email,
            address, bio, occupation, expertise, is_mentor FROM user_table
       WHERE  id= ${ req.params.id} and is_mentor= ${true} 

            `;
         db.pool.query(fetchMentor)
            .then(({ rows }) => {
               
                if (!rows[0]) {
                    return res.status(404).json({
                        status: 404,
                        data: "Mentor not found"
                    })
                }

                 res.status(200).json({
                    status: 200,
                    data: rows[0]
                })

            })
            .catch((error) => {

                return res.status(500).json({
                    status: 500,
                    error
                });
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
        const oneMentor = `
        SELECT  * FROM user_table 
       WHERE  id= ${ req.params.id} `;

        const userToMentor = `
        UPDATE user_table SET is_mentor = ${true} WHERE id = ${req.params.id}
        returning id,first_name, last_name, email,
        address, bio, occupation, expertise, is_mentor
        `;

        db.pool.query(oneMentor)
            .then(({ rows }) => {
                if (!rows[0]) {
                    return res.status(404).json({
                        status: 404,
                        data: "user not found"
                    })
                }
                if (rows[0].is_mentor) {
                    return res.status(400).json({
                        status: 400,
                        message: "user is already a mentor"
                    })
                }
                db.pool.query(userToMentor)
                    .then(({ rows }) => {
                        return res.status(200).json({
                            status: 200,
                            message: "User account changed to mentor",
                            data: rows[0]
                        })
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

    }


}
