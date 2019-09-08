import {Pool } from 'pg';
import env from 'dotenv';
// import users from './server/models/users';

// conat onnectionString = 'postgressql://postgres:postgres@localhost:54'
env.config();

class DatabaseSetup{
    constructor (){
        this.pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            password: process.env.PG_PASSWORD,
            port: process.env.PG_PORT

        });
        this.pool.on('connect', ()=> {
            console.log('connected...');
        });

        this.pool.on('error', (error) => {
            console.log('error', error);
        })

        this.createTables();
    }

    async createTables(){

        const  users = `
        CREATE TABLE IF NOT EXISTS user_table(
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(30) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            address VARCHAR(50) NOT NULL,
            bio VARCHAR(100) NOT NULL ,
            occupation VARCHAR(30) NOT NULL,
            expertise VARCHAR(30) NOT NULL,
            is_mentor BOOLEAN NOT NULL DEFAULT false,
            is_admin BOOLEAN NOT NULL DEFAULT false
        )`;

        await this.pool.query(users)
         .then((res) => {
             console.log("users table created...")
         })

         .catch((error) =>{
             console.log(error.message);
         })

         const sessions = `
         CREATE TABLE IF NOT EXISTS sessions(
             sessionID SERIAL PRIMARY KEY,
             mentorID  INT NOT NULL REFERENCES user_table(id) UNIQUE ,
             menteeID INT NOT NULL REFERENCES user_table(id) UNIQUE,
             questions VARCHAR(140) NOT NULL,
             menteeEmail VARCHAR(40) REFERENCES user_table(email) NOT NULL UNIQUE,
             status VARCHAR(8) NOT NULL DEFAULT 'pending'
         )`;

         await this.pool.query(sessions)
         .then((res) =>{
             console.log("sessions table created...");
         })
         .catch((error)=>{
             console.log(error.message);
         })

         
         
    }
}

export default new DatabaseSetup();
