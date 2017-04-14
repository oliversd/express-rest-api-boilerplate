import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import chaiHttp from 'chai-http';

import app from '../config/app';
// import User from '../models/user-model';

mongoose.Promise = global.Promise; // set native Promise lib

chai.use(chaiHttp);

chai.config.includeStack = true; // turn on stack trace

// Set to test to use dev database
process.env.NODE_ENV = 'test';

describe('User endopoints', () => {
  it('should list ALL users on /user GET', (done) => {
    chai.request(app)
      .get('/api/user')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('users');
        expect(res.body.users).to.be.instanceof(Array);
        done();
      })
      .catch(done());
  });
  it('should add a SINGLE user on /user POST', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({ email: 'test@test.test', password: '12345', firstName: 'Test', lastName: 'Testing' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal('Ok');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('User created');
        done();
      })
      .catch(done());
  });
  it('should list a SINGLE user on /user/:id GET');
  it('should update a SINGLE user on /user/:id PUT');
  it('should delete a SINGLE user on /user/:id DELETE');
});
