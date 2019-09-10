import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
import db from '../../database/database';
import jwt from 'jsonwebtoken';
import users from '../mockData/userMocks'
dotenv.config();
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
chai.should();


describe('user test', () => {
    let userToken, mentorToken;
    before(() => {
        const deleteTables = `
        DELETE FROM user_table
        `
        db.pool.query(deleteTables);

    })
    after(() => {
        const deleteTables = `
        DELETE FROM user_table
        `
        db.pool.query(deleteTables);
    })
    it('should return user created', (done) => {
        chai.request(app)
            .post('/api/v1/auth/signup')
            .send(users.newUser1)
            .end((err, res) => {
                userToken = res.body.data.token;

                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(201);
                res.body.should.have.property('message').eql('user created successfully ');
                res.body.data.should.have.property('token');
                done();
            })
    })

    it('should return mentor created', (done) => {
        chai.request(app)
            .post('/api/v1/auth/signup')
            .send(users.newMentor)
            .end((err, res) => {
                mentorToken = res.body.data.token;
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(201);
                res.body.should.have.property('message').eql('user created successfully ');
                res.body.data.should.have.property('token');
                // res.body.data.should.have.property('is_mentor').eql(true);
                done();
            })
    })

    it('should return can not be both admin and mentor', (done) => {


        chai.request(app)
            .post('/api/v1/auth/signup')
            .send(users.newUser2)
            .end((err, res) => {
                expect(res.statusCode).to.equal(403);
                done();
            })
    })
    it('should return email with invalid format', (done) => {


        chai.request(app)
            .post('/api/v1/auth/signup')
            .send(users.newUser3)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                done();
            })
    })
    it('should return login sucessfully', (done) => {


        chai.request(app)
            .post('/api/v1/auth/signin')
            .send(users.newUser4)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('token');
                res.body.should.have.property('message').eql("user is successfully logged in");
                done();
            })
    })

    it('should return email or password not correct', (done) => {
        const newUser = {
            email: "usertest@gmail.com",
            password: "efotecbudari"
        }

        chai.request(app)
            .post('/api/v1/auth/signin')
            .send(newUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(403);
            })
        done();
    })
})