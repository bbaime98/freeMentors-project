import mocha from 'mocha';
import chai,{expect} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import jwt from 'jsonwebtoken';

dotenv.config();
chai.use(chaiHttp);
chai.should();


describe('USER test',()=>{
    it('should return account created',(done)=>{
       const newUser = {
        first_name:"kwizera",
        last_name:"christophe",
        email:"kabundege@gmail.com",
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
           expect(res.body).to.have.property('data');
           expect(res.body.data).have.property('token');
          // expectroperty('message').eql("user created successfully");
           done();
       })
    })
    it('should create admin account',(done)=>{
        const newUser = {
         first_name:"kwizera",
         last_name:"christophe",
         email:"admin@gmail.com",
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
            res.should.have.status(201);
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('data');
            res.body.data.should.have.property('token');
            res.body.should.have.property('message').eql("user created successfully");
           // expectroperty('message').eql("user created successfully");
            done();
        })
     })    
     it('should create mentor account',(done)=>{
        const newUser = {
         first_name:"bien",
         last_name:"aime",
         email:"mentor@gmail.com",
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
            res.should.have.status(201);
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('data');
            res.body.data.should.have.property('token');
            res.body.should.have.property('message').eql("user created successfully");
            done();
        })
     })
        it('should return can be both adminand mentor',(done)=>{
        const newUser = {
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
        const newUser = {
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
    // it('should return all users',(done)=>{
    //     const token = jwt.sign({
    //         id:1,
    //         is_mentor:false,
    //         is_admin:true,
    //         email:"kabundege@gmail.com"
    //     },process.env.JWTPRIVATEKEY);

    //     chai.request(app)
    //     .get('/api/v1/users')
    //     .set('token',token)
    //     .end((err,res)=>{
    //         expect(res.statusCode).to.equal(200);
    //         done();
    //     })
    // })
    it('should return email already taken',(done)=>{
        const newUser = {
         first_name:"kwizera",
         last_name:"christophe",
         email:"kabundege@gmail.com",
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
            expect(res.statusCode).to.equal(409);
            done();
        })
    })
    it('should return login sucessfully',(done)=>{
        const newUser = {
         email:"kabundege@gmail.com",
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
    it('should return user not found',(done)=>{
        const newUser = {
         email:"kwiz@gmail.com",
         password: "efotec"
        }
 
        chai.request(app)
        .post('/api/v1/auth/signin')
        .send(newUser)
        .end((err,res)=>{
            expect(res.statusCode).to.equal(404);
            done();
        })
    })
    it('should return email or password not correct',(done)=>{
        const newUser = {
         email:"kabundege@gmail.com",
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