import {Pool } from 'pg';
import env from 'dotenv';
import { parse } from 'path';

env.config();

const adminDetails = {
    first_name: 'user', 
    first_name: 'user' ,
    last_name: 'admin' ,
     email: process.env.EMAIL , 
     password: process.env.PASSWORD , 
     address: 'kigali' ,
     bio: 'am admin', 
     occupation: 'admin', 
     expertise: 'manager',
     is_mentor: 'false' ,
     is_admin: 'true'
 }
class DatabaseSetup{
    constructor (){
       
        this.pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.NODE_ENV ? process.env.TEST_DB : process.env.PG_DATABASE,
            password: process.env.PG_PASSWORD,
            port: process.env.PG_PORT

        });
        this.pool.on('connect', ()=> {
            
        });

        this.pool.on('error', (error) => {
            
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
            
         })

         .catch((error) =>{
             
         })

         const sessions = `
         CREATE TABLE IF NOT EXISTS sessions(
             sessionID SERIAL PRIMARY KEY,
             mentorID  INT NOT NULL REFERENCES user_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
             menteeID INT NOT NULL REFERENCES user_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
             questions VARCHAR(140) NOT NULL,
             menteeEmail VARCHAR(40) REFERENCES user_table(email) NOT NULL ,
             status VARCHAR(8) NOT NULL DEFAULT 'pending'
         )`;

         await this.pool.query(sessions)
         .then((res) =>{
            
         })
         .catch((error)=>{
             
         })
         
         const  createAdmin = `
        INSERT INTO user_table(
             first_name  ,
             last_name ,
             email ,
             password ,
             address ,
             bio  ,
             occupation ,
             expertise ,
             is_mentor ,
             is_admin ) 
         
             VALUES ( '${adminDetails.first_name}', '${adminDetails.last_name}', '${adminDetails.email}', '${adminDetails.password}', '${adminDetails.address}', '${adminDetails.bio}', '${adminDetails.occupation}', '${adminDetails.expertise}', '${adminDetails.is_mentor}', '${adminDetails.is_admin}') on conflict (email) do nothing `;
 
         await this.pool.query(createAdmin)
          .then((res) => {
              
          })
 
          .catch((error) =>{
              
          })
 
        
         
    }
}

export default new DatabaseSetup();
