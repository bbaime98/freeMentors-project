import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';
chai.use(chaiHttp);
chai.should();
describe('session test',()=>{
    let newUser, userToken, newMentor, mentorToken, mentorId;
    before(()=>{
        newUser = {
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
        newMentor = {
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
        
    })
    it('should return user created',(done)=>{
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            userToken = res.body.data.token;
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('message').eql('user created successfully');
            res.body.data.should.have.property('token');
            res.body.data.should.have.property('id');
            res.body.data.should.have.property('first_name').eql('aime');
            res.body.data.should.have.property('email').eql('sessiontest@gmail.com');
            res.body.data.should.have.property('is_mentor').eql(false);
            done();
        })
    })
   
    it('should return mentor created',(done)=>{
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newMentor)
        .end((err,res)=>{
            mentorToken = res.body.data.token;
            mentorId = res.body.data.id;
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('message').eql('user created successfully');
            res.body.data.should.have.property('token');
            res.body.data.should.have.property('id');
            res.body.data.should.have.property('first_name').eql('aime');
            res.body.data.should.have.property('email').eql('sessionmentor@gmail.com');
            res.body.data.should.have.property('is_mentor').eql(true);
            done();
        })
    })

    it('should return Error when mentor not found',(done)=>{
        const newSession ={
            questions:"i have issues with my life",
            mentorId:46547
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token',userToken)
        .send(newSession)
        .end((err,res)=>{
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(404);
            res.body.should.have.property('error').eql('Mentor not found');
            done();       
        })
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

    it('should return Error Only a mentor can perform this action',(done)=>{
        const newSession ={
            questions:"i have issues with my life",
            mentorId:2
        }
        chai.request(app)
        .patch(`/api/v1/sessions/${1}/reject`)
        .set('token',userToken)
        .send(newSession)
        .end((err,res)=>{

            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(403);
            res.body.should.have.property('error').eql('Only a mentor can perform this action');
            done();       
        })
    });
    it('should return Error Session not Found',(done)=>{
        const newSession ={
            questions:"i have issues with my life",
            mentorId:2
        }
        chai.request(app)
        .patch(`/api/v1/sessions/${7}/reject`)
        .set('token',mentorToken)
        .send(newSession)
        .end((err,res)=>{
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(404);
            res.body.should.have.property('error').eql('Session not Found');
            done();       
        })
    });

    it('should Session created sucessfully',(done)=>{
        const newSession = {
            mentorId,
            questions: 'what is this',           
        }
        chai.request(app)
        .post('/api/v1/sessions')
        .set('token', userToken)
        .send(newSession)
        .end((err,res)=>{

            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('message').eql('Session created sucessfully');
            res.body.should.have.property('data');
            done();       
        })
    });
    it('should Session reject sucessfully',(done)=>{
        const newSession = {
            sessionId: 1,
            mentorId: mentorId,
            menteeId: 1,
            questions: "yoo what's up",
            menteeEmail: "sessiontest@gmail.com",
            status: "rejected"        
        }
        chai.request(app)
        .patch(`/api/v1/sessions/${1}/reject`)
        .set('token', mentorToken)
        .send(newSession)
        .end((err,res)=>{
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            done();       
        })
    });
    it('should Session accepted sucessfully',(done)=>{
        const newSession = {
            sessionId: 1,
            mentorId: mentorId,
            menteeId: 1,
            questions: "yoo what's up",
            menteeEmail: "sessiontest@gmail.com",
            status: "accepted"        
        }
        chai.request(app)
        .patch(`/api/v1/sessions/${1}/accept`)
        .set('token', mentorToken)
        .send(newSession)
        .end((err,res)=>{
            console.log(res.body)
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            done();       
        })
    });
    it('should all sessions',(done)=>{
        const newSession = {
            sessionId: 1,
            mentorId: mentorId,
            menteeId: 1,
            questions: "yoo what's up",
            menteeEmail: "sessiontest@gmail.com",
            status: "accepted"        
        }
        chai.request(app)
        .get('/api/v1/sessions')
        .set('token',userToken)
        .send(newSession)
        .end((err,res)=>{

            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            done();       
        })
    });
    
})