import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../../src/models/user';
import Client from '../../src/models/client';
import AccessToken from '../../src/models/accesstoken';
import RefreshToken from '../../src/models/refreshtoken';
import logger from '../../src/helpers/logger';

// During the test the env variable is set to test
chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

const server = require('../../src/config/app');

const dbURI = 'mongodb://localhost/testing-db';
describe('Auth spec for a routes', () => {
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
    Client.remove().exec();
    AccessToken.remove().exec();
    RefreshToken.remove().exec();
    mongoose.connection.close().catch(err => logger.error(err));
  });

  const user = {
    email: 'test@test.com',
    password: 'asdasdasd',
    firstName: 'Testy',
    lastName: 'Tiesto'
  };

  let client = null;

  describe('POST /api/users', () => {
    it('it should create a new client', (done) => {
      new Client({ name: 'testclient' }).save().then((_client) => {
        client = _client;
        expect(_client.name).to.equal('testclient');
        Client.encryptSecret(_client._id, (err) => {
          if (err) {
            return done(err);
          }
          return done();
        });
      }).catch(done);
    });
    it('it should create a new user', (done) => {
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          return done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('POST /api/auth/oauth', () => {
    it('it should login an user', (done) => {
      const auth = {
        username: user.email,
        password: user.password,
        grant_type: 'password',
        client_id: client.id,
        client_secret: client.secret
      };
      chai.request(server)
        .post('/api/auth/oauth')
        .send(auth)
        .end((err, res) => {
          // res.should.have.status(201);
          // res.body.should.be.a('object');
          console.log(auth);
          console.log(res.body);
          return done();
        });
    });
  });
});
