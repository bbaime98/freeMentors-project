import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';
 import users from '../mockData/userMocks'
dotenv.config();
chai.use(chaiHttp);
chai.should();


describe('mentors test',()=>{
    let  userToken, mentorToken, adminToken, mentorId = 4;
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
    it('should return mentor found',(done)=>{
       
        chai.request(app)
        .get(`/api/v1/mentors/${mentorId}`)
        .set('token',userToken)
        .end((err,res)=>{
            
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('data');
            done();
        })
    });

    it('should return admin logged in',(done)=>{
         
        chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users.admin)
        .end((err,res)=>{
            adminToken = res.body.data.token;
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('data');
            res.body.should.have.property('message').eql("user is successfully logged in");
            done();
        })
    });

    it('should return user  changed to a metor',(done)=>{
        
        chai.request(app)
        .patch('/api/v1/user/1')
        .set('token',adminToken)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('message').eql("User account changed to mentor");
        })
        done();
    })
   
 })
