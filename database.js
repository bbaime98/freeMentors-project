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

    createTables(){

        const  users = `
        CREATE TABLE IF NOT EXISTS user_table(
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(40) NOT NULL UNIQUE,
            address VARCHAR(40) NOT NULL,
            bio VARCHAR(40) NOT NULL ,
            occupation VARCHAR(40) NOT NULL UNIQUE,
            expertise VARCHAR(40) NOT NULL UNIQUE,
            is_mentor BOOLEAN NOT NULL DEFAULT false,
            is_admin BOOLEAN NOT NULL DEFAULT false
        )`;

         this.pool.query(users)
         .then((res) => {
             console.log("users table created...")
         })

         .catch((error) =>{
             console.log(error.message);
         })

         const sessions = `
         CREATE TABLE IF NOT EXISTS sessions(
             sessionID SERIAL PRIMARY KEY,
             mentorID  INT NOT NULL UNIQUE ,
             meenteID INT NOT NULL UNIQUE,
             questions VARCHAR(100) NOT NULL,
             menteeEmail VARCHAR(40) NOT NULL UNIQUE,
             status CHAR(8) NOT NULL DEFAULT 'pending'
         )`;

         this.pool.query(sessions)
         .then((res) =>{
             console.log("sessions table created...");
         })
         .catch((error)=>{
             console.log(error.message);
         })

         
         
    }
}

export default new DatabaseSetup();
