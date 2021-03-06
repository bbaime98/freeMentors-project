import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';
 import users from '../mockData/userMocks'
import db from '../../database/database';
dotenv.config();
chai.use(chaiHttp);
chai.should();


describe('sessions test',()=>{
    let sessionId;
    before(() => {
        const deleteUserTable = `
        DELETE FROM user_table
        `
        db.pool.query(deleteUserTable);

        const deleteSessionTable = `
        DELETE FROM sessions
        `
        db.pool.query(deleteSessionTable);
    
    });

    let  userToken, mentorToken, adminToken, mentorId = 4, mentorIDD;
    it('should return user created',(done)=>{
         
        chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users.newUser5)
        .end((err,res)=>{
            userToken = res.body.data.token;
            expect(res.statusCode).to.equal(201);
            done();
        })
    });
    it('should return mentor created',(done)=>{

        chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users.mentorController1)
        .end(async(err,res)=>{
            const fetchId = `SELECT id FROM user_Table WHERE email = '${users.mentorController1.email}'`
             const {rows} = await db.pool.query(fetchId);
              mentorIDD = rows[0].id;
            mentorToken = res.body.data.token;
            expect(res.statusCode).to.equal(201);
            done();
        })
    }).timeout(5000);
    it('should return session created',(done)=>{

        chai.request(app)
        .post('/api/v2/sessions')
        .send({
            mentorId: `${mentorIDD}`,
            questions: 'Okay lit si cool',
        })
        .set('token', userToken)
        .end((err,res)=>{
            sessionId = res.body.data[0].sessionid;
            expect(res.statusCode).to.equal(200);
            done();
        })
    })

    it('should return session accepted',(done)=>{

        chai.request(app)
        .patch(`/api/v2/sessions/${sessionId}/accept`)
        .set('token', mentorToken)
        .end((err,res)=>{
           
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('message').eql('Session is Accepted');
            done();
        })
    });
    it('should return session rejected',(done)=>{

        chai.request(app)
        .patch(`/api/v2/sessions/${sessionId}/reject`)
        .set('token', mentorToken)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('message').eql('Session is Rejected');
            done();
        })
    })
})   
 