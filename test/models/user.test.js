import chai from 'chai';
import mongoose from 'mongoose';
import User from '../../src/models/user';
import logger from '../../src/helpers/logger';

const expect = chai.expect;
const dbURI = 'mongodb://localhost/testing-db';

mongoose.Promise = global.Promise;

const user = {
  email: 'test@test.com',
  password: 'asdasdasd',
  profile: {
    firstName: 'Testy',
    lastName: 'Tiesto'
  }
};

let _id = null;

describe('User spec for a model', () => {
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

  it('can be saved', (done) => {
    new User(user).save().then((_user) => {
      expect(_user.email).to.equal(user.email);
      expect(_user.profile.firstName).to.equal(user.profile.firstName);
      expect(_user.profile.lastName).to.equal(user.profile.lastName);
      _id = _user._id;
      done();
    }).catch(done);
  });

  it('can be found by email', (done) => {
    User.findByEmail(user.email).then((_user) => {
      expect(_user.email).to.equal(user.email);
      expect(_user.profile.firstName).to.equal(user.profile.firstName);
      expect(_user.profile.lastName).to.equal(user.profile.lastName);
      done();
    }).catch(done);
  });

  it('can verify password', (done) => {
    User.findOne({ email: user.email }).then((_user) => {
      _user.verifyPassword(user.password, (err, verified) => {
        if (err) {
          done(err);
        }
        expect(verified).to.equal(true);
        done();
      });
    }).catch(done);
  });

  it('can be found by id', (done) => {
    User.findById(_id).then((_user) => {
      expect(_user._id.toString()).to.equal(_id.toString());
      expect(_user.email).to.equal(user.email);
      expect(_user.profile.firstName).to.equal(user.profile.firstName);
      expect(_user.profile.lastName).to.equal(user.profile.lastName);
      done();
    }).catch(done);
  });

  it('can be listed', (done) => {
    User.list().then((_users) => {
      expect(_users).to.be.an('array');
      expect(_users).to.have.lengthOf(1);
      done();
    }).catch(done);
  });
});
