import jwt from 'jsonwebtoken';
import users from '../models/users';
import bcrypt from 'bcrypt';
import db from '../../database'
export default class USers {
    static async signup(req, res) {
        const {
            first_name,
            last_name,
            email,
            password,
            address,
            bio,
            occupation,
            expertise,
            is_mentor,
            is_admin
        } = req.body;

        // const user = users.find(userof => userof.email === req.body.email);

        // if (user) {
        //     return res.status(409).json({
        //         status: 409,
        //         error: "the email already exists"
        //     })
        // }
        const newUser = [
            first_name,
            last_name,
            email,
            bcrypt.hashSync(password, 10),
            address,
            bio,
            occupation,
            expertise,
            is_mentor || false,
            is_admin || false
        ]

        if (is_admin && is_mentor) {
            return res.status(403).json({
                status: 403,
                error: " not allowed to be both admin and mentor "
            })
        }

        const insertUser = `
        INSERT INTO user_table(first_name, last_name, email, password, address, bio, occupation, expertise, is_mentor, is_admin)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning first_name, last_name, email, address, bio, occupation, expertise, is_mentor, is_admin
        `;
        await db.pool.query(insertUser, newUser)
        .then((response) => {
            const token = jwt.sign({
                id: response.rows[0].id,
                is_mentor: is_mentor,
                is_admin: is_admin,
                email: email
            }, process.env.JWTPRIVATEKEY);

            res.status(201).json({
                status: 201,
                message: "user created successfully ",
                data: {
                    ...response.rows[0],
                    token
                } 
            })
        })
        .catch((error) => {
            console.log('error', error)
            res.status(500).json({
                status: 500,
                error
            });
        })

        
    }
    static signin(req, res) {
        const user = users.find(userof => userof.email === req.body.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                error: "User not found"
            })
        }
        const password = bcrypt.compareSync(req.body.password, user.password);
        if (!password) {
            return res.status(403).json({
                status: 403,
                error: "Invalid email or password"
            })
        }
        const token = jwt.sign({
            id: user.id,
            is_mentor: user.is_mentor,
            is_admin: user.is_admin,
            email: user.email
        }, process.env.JWTPRIVATEKEY)
        res.header('token', token)
        res.status(200).json({
            status: 200,
            message: "user is successfully logged in",
            data: {
                token: token,
                id: user.id,
                first_name: user.first_name,
                email: user.email
            }
        })
    }

}
