import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import db from '../../database/database';
import jwt from 'jsonwebtoken';

dotenv.config();
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
chai.should();


describe.only('user test',()=>{
    let newUser, userToken, newMentor, mentorToken;
    before(()=>{
        const deleteTables = `
        DELETE FROM user_table
        `
        db.pool.query(deleteTables);

        newUser = {
            first_name:"aime",
            last_name:"bien",
            email:"usertest@gmail.com",
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
            email:"mentortest@gmail.com",
            password: "efotec",
            address:"kk 798 st",
            bio:"A young Rwandan programmer",
            occupation:"programmer",
            expertise:"JS",
            is_mentor:true,
            is_admin:false
        }
        
    })
    after(()=>{
        const deleteTables = `
        DELETE FROM user_table
        `
        db.pool.query(deleteTables);
    })
    it('should return user created',(done)=>{
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
         .end((err,res)=>{
            userToken = res.body.data.token;
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('message').eql('user created successfully ');
            res.body.data.should.have.property('token');
            done();
        })
    })
   
    it('should return mentor created',(done)=>{
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newMentor)
        .end((err,res)=>{
            mentorToken = res.body.data.token;
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('message').eql('user created successfully ');
            res.body.data.should.have.property('token');
            res.body.data.should.have.property('is_mentor').eql(true);
            done();
        })
    })

        it('should return can be both adminand mentor',(done)=>{
        newUser = {
         first_name:"qaime",
         last_name:"bien",
         email:"aime@gmail.com",
         password: "andela123",
         address:"kk 798 st",
         bio:"A young Rwandan programmer",
         occupation:"programmer",
         expertise:"JS",
         is_mentor:true,
         is_admin:true
        }
 
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(403);
            done();
        })
    })
    it('should return email with invalid format',(done)=>{
        newUser = {
         first_name:"kwizera",
         last_name:"christophe",
         email:"bienaime.com",
         password: "efotec",
         address:"kk 798 st",
         bio:"A young Rwandan programmer",
         occupation:"programmer",
         expertise:"JS"
        }
 
        chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
            done();
        })
    })
    it('should return login sucessfully',(done)=>{
        const newUser = {
         email:"usertest@gmail.com",
         password: "efotec"
        }
 
        chai.request(app)
        .post('/api/v1/auth/signin')
        .send(newUser)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('data');
            res.body.data.should.have.property('token');
            res.body.should.have.property('message').eql("user is successfully logged in");
            done();
        })
    })

    it('should return email or password not correct',(done)=>{
        const newUser = {
         email:"usertest@gmail.com",
         password: "efotecbudari"
        }
 
        chai.request(app)
        .post('/api/v1/auth/signin')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(403);
        })
        done();
    })
})