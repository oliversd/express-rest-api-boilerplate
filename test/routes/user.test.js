import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../../src/models/user';
import logger from '../../src/helpers/logger';

// During the test the env variable is set to test
chai.use(chaiHttp);
chai.should();

const server = require('../../src/config/app');

const dbURI = process.env.MONGO_URI || 'mongodb://localhost/testApiDb';

describe('User spec for a routes', () => {
  before(() => {
    // runs before all tests in this block
    mongoose.connect(dbURI, {
      server: {
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
      }
    }).catch(err => logger.error(err));
  });

  after(() => {
    // runs after all tests in this block
    // mongoose.connection.db.dropDatabase().catch(err => logger.error(err));
    User.remove().exec();
    mongoose.connection.close().catch(err => logger.error(err));
  });

  describe('GET /api/users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.users.should.be.a('array');
          res.body.users.length.should.be.eql(0);
          done();
        });
    });
  });

  let _user = null;
  describe('POST /api/users', () => {
    it('it should POST a new user', (done) => {
      const user = {
        email: 'test@test.com',
        password: 'asdasdasd',
        firstName: 'Testy',
        lastName: 'Tiesto'
      };
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should GET all the users with the new one', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.users.should.be.a('array');
          res.body.users.length.should.be.eql(1);
          _user = res.body.users[0];
          done();
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('it should GET an user', (done) => {
      chai.request(server)
        .get(`/api/users/${_user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('_id');
          res.body.user.should.have.property('updatedAt');
          res.body.user.should.have.property('createdAt');
          res.body.user.should.have.property('email');
          res.body.user.should.have.property('lastLogin');
          res.body.user.should.have.property('profile');
          res.body.user.should.have.property('verified');
          done();
        });
    });
  });

  describe('PUT /users/:id', () => {
    it('it should UPDATE an user given the id', (done) => {
      chai.request(server)
        .put(`/api/users/${_user._id}`)
        .send({ firstName: 'Asdio', lastName: 'Qwertson' })
        .end((err, res) => {
          res.should.have.status(205);
          done();
        });
    });
    it('it should GET an updated user', (done) => {
      chai.request(server)
        .get(`/api/users/${_user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('_id');
          res.body.user.should.have.property('updatedAt');
          res.body.user.should.have.property('createdAt');
          res.body.user.should.have.property('email');
          res.body.user.should.have.property('lastLogin');
          res.body.user.profile.should.have.property('firstName').equal('Asdio');
          res.body.user.profile.should.have.property('lastName').equal('Qwertson');
          res.body.user.should.have.property('verified');
          done();
        });
    });
  });

  let resetToken = null;
  describe('POST /api/users/forgot', () => {
    it('it should GET a sent email message', (done) => {
      chai.request(server)
        .post('/api/users/forgot')
        .send({ email: 'test@test.com' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          resetToken = res.body.message.split(' ')[0];
          res.body.message.split(' ')[2].should.be.equal('Reset');
          done();
        });
    });
    it('it should GET an user with reset token', (done) => {
      chai.request(server)
        .get(`/api/users/${_user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.reset.should.have.property('token').not.equal(null);
          res.body.user.reset.should.have.property('expires').not.equal(null);
          done();
        });
    });
  });

  describe('GET /api/users/:id/reset', () => {
    it('it should GET "Password changed" message', (done) => {
      chai.request(server)
        .get(`/api/users/${_user._id}/reset?token=${resetToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').equal('Password changed');
          done();
        });
    });
    it('it should GET an user without reset token', (done) => {
      chai.request(server)
        .get(`/api/users/${_user._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('changePassword').equal(true);
          res.body.user.should.have.property('reset');
          res.body.user.reset.should.have.property('token').equal(null);
          res.body.user.reset.should.have.property('expires').equal(null);
          done();
        });
    });
  });
});
