import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';
import { getMaxListeners } from 'cluster';
 
dotenv.config();
chai.use(chaiHttp);
chai.should();


describe('mentors test',()=>{
    it('should return user created',(done)=>{
        const newUser = {
         first_name:"aime",
         last_name:"bien",
         email:"christophe@gmail.com",
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
         email:"admin2@gmail.com",
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
         email:"mentor1@gmail.com",
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

    it('should return invalid params',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"admin@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .patch(`/api/v1/user/${'fgdf'}`)
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
        })
        done();
    })
    it('should return user not found',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"admin@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .patch('/api/v1/user/10')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(404);
            done();
        })
    })
    it('should return not admin',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:false,
            email:"olivier@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .patch('/api/v1/user/1')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(403);
        })
        done();
    })
    it('should return user was changed to a metor',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"admin@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .patch('/api/v1/user/1')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
        })
        done();
    })
    it('should return is already a mentor',(done)=>{
        const token = jwt.sign({
            id:2,
            is_mentor:false,
            is_admin:true,
            email:"admin@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .patch('/api/v1/user/1')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(400);
        })
        done();
    })

    it('should return all mentors to the user',(done)=>{
        const token = jwt.sign({
            id:5,
            is_mentor:false,
            is_admin:false,
            email:"user1@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .get('/api/v1/mentors')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
            res.body.should.have.property('data');
        })
        done();
    });

    it('should return no token provided',(done)=>{
        chai.request(app)
        .get('/api/v1/mentors')
        .end((err,res)=>{
            expect(res.statusCode).to.equal(401);
        })
        done();
    })
    it('should return a specific mentor',(done)=>{
        const token = jwt.sign({
            id:1,
            is_mentor:false,
            is_admin:false,
            email:"jeanByiringiro@gmail.com"
        },process.env.JWTPRIVATEKEY);
        chai.request(app)
        .get('/api/v1/mentors/1')
        .set('token',token)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(200);
        })
        done();
    });
 })
