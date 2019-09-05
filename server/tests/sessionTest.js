import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('session test',()=>{
    it('should return user created',(done)=>{
        const newUser = {
         first_name:"aime",
         last_name:"bien",
         email:"sessiontest@gmail.com",
         password: "efotec",
         address:"kk 798 st",
         bio:"A young Rwandan programmer",
         occupation:"programmer",
         expertise:"JS",
         is_mentor:false,
         is_admin:false
        }
 
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(201);
            done();
        })
    })
    it('should return admin created',(done)=>{
        const newUser = {
         first_name:"aime",
         last_name:"bien",
         email:"sessionadmin@gmail.com",
         password: "efotec",
         address:"kk 798 st",
         bio:"A young Rwandan programmer",
         occupation:"programmer",
         expertise:"JS",
         is_mentor:false,
         is_admin:true
        }
 
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(201);
            done();
        })
    })
    it('should return mentor created',(done)=>{
        const newUser = {
         first_name:"aime",
         last_name:"bien",
         email:"sessionmentor@gmail.com",
         password: "efotec",
         address:"kk 798 st",
         bio:"A young Rwandan programmer",
         occupation:"programmer",
         expertise:"JS",
         is_mentor:true,
         is_admin:false
        }
 
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(201);
            done();
        })
    })

    it('should return  session created sucessfully',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"mentor1@gmail.com"
        },process.env.JWTPRIVATEKEY);
        const newSession ={
            questions:"i have issues with my life",
            mentorId:3
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token',token)
        .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(201);
            res.body.should.have.property('data');
           // res.body.data.should.have.property(newSession);
            
        })
        done();
    });
        it('should return questions are required',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"byiri@gmail.com"
        },process.env.JWTPRIVATEKEY);
        const newSession = {
            mentorId: 3,
            questions: ""
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token',token)
        .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
        })
        done();
    });
    it('should return mentor ID are required',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"byiri@gmail.com"
        },process.env.JWTPRIVATEKEY);
        const newSession = {
            mentorId: "",
            questions: " this is a qiestion"
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token',token)
        // .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
        })
        done();
    });
    it('should return enter valid session  ID ',(done)=>{
        const token = jwt.sign({
            id:5,
            is_mentor:true,
            is_admin:false
        },process.env.JWTPRIVATEKEY);
        const newSession = {
            mentorId: 3,
            questions: " this is a qiestion"
        }
        chai.request(app)
        .patch('/api/v1/sessions/tyui/reject')
        .set('token',token)
        .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
        })
        done();
    });
    it('should return no session was found ',(done)=>{
        const token = jwt.sign({
            id:5,
            is_mentor:true,
            is_admin:false
        },process.env.JWTPRIVATEKEY);
        const newSession = {
            mentorId: 3,
            questions: " this is a qiestion"
        }
        chai.request(app)
        .patch('/api/v1/sessions//reject')
        .set('token',token)
        .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(404);
        })
        done();
    });
    it('should returnCan not request a session to yourself',(done)=>{
        const newUser = {
            first_name:"aime",
            last_name:"bien",
            email:"request@gmail.com",
            password: "efotec",
            address:"kk 798 st",
            bio:"A young Rwandan programmer",
            occupation:"programmer",
            expertise:"JS",
            is_mentor:true,
            is_admin:false
           }
    
        const newSession = {
            mentorId: 6,
            questions: " this is a qiestion"
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token',token)
        .send(newSession)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(404);
            res.body.should.have.property('error').eql('Mentor not found');
        })
        done();
    });

})