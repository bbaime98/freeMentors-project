import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';
import { getMaxListeners } from 'cluster';
 import users from '../mockData/userMocks'
dotenv.config();
chai.use(chaiHttp);
chai.should();


describe('mentors test',()=>{
    let  userToken, mentorToken;
    it('should return user created',(done)=>{
         
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users.newUser5)
        .end((err,res)=>{
            userToken = res.body.data.token;
            expect(res.statusCode).to.equal(201);
            done();
        })
    })
 
    it('should return mentor created',(done)=>{

        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users.mentorController1)
        .end((err,res)=>{
            mentorToken = res.body.data.token;
            expect(res.statusCode).to.equal(201);
            done();
        })
    })

     it('should return all mentors ',(done)=>{
     
        chai.request(app)
        .get('/api/v1/mentors')
        .set('token',userToken)

        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('data');
        })
        done();
    })

    it('should return no token provided',(done)=>{
        chai.request(app)
        .get('/api/v1/mentors')
        .end((err,res)=>{
            expect(res.statusCode).to.equal(401);
        })
        done();
    })
  

 })
