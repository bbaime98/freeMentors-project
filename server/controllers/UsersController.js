import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../database/database'
export default class USers {
    static  signup(req, res) {
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
             false
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
        returning id, first_name, last_name, email, address, bio, occupation, expertise, is_mentor, is_admin
        `;
         db.pool.query(insertUser, newUser)
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
                    
                    token
                } 
            })
        })
        .catch((error) => {
            res.status(409).json({
                status: 409,
                error: 'Email already exist'
            });
        })

        
    }
    static  signin(req, res) {

        const {email , password } = req.body;
        const getUser = `
        SELECT * FROM user_table 
        WHERE  email = '${email}'
        `
         db.pool.query(getUser)
        .then(({rows}) => {
           
            if (rows.length < 0) {
                
                return res.status(401).json({
                    status: 401,
                    error: "Invalid email or password"
                });
            }
            const { password:userPassword, is_mentor, is_admin, id, first_name } = rows[0];
            
            const comparePassword = bcrypt.compareSync(password, userPassword);
            
            if(comparePassword){
                const token = jwt.sign({
                    id,
                    is_mentor,
                    is_admin,
                    email
                }, process.env.JWTPRIVATEKEY);
    
                return res.status(200).json({
                    status: 200,
                    message: "user is successfully logged in",
                    data: {
                        id,
                        first_name,
                        email,
                        token
                    }
                })

            } 
            return res.status(401).json({
                status: 401,
                error: "Invalid email or password"
            });

        })
        .catch(error => {
           
            res.status(500).send({
                status: 500,
                error
            });
        })
        
        

        
    }

}
