import chai from 'chai';
import mongoose from 'mongoose';
import User from '../../src/models/user-model';

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

let id = null;

describe('Example spec for a model', () => {
  before(() => {
    // runs before all tests in this block
    mongoose.connect(dbURI, {
      server: {
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
      }
    });
  });

  after(() => {
    // runs after all tests in this block
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
  });

  it('can be saved', (done) => {
    new User(user).save().then((_user) => {
      expect(_user.email).to.equal(user.email);
      expect(_user.profile.firstName).to.equal(user.profile.firstName);
      expect(_user.profile.lastName).to.equal(user.profile.lastName);
      id = _user._id;
      done();
    }).catch(err => done(err));
  });

  it('can be found by email', (done) => {
    User.findByEmail('test@test.com').then((_user) => {
      expect(_user.email).to.equal(user.email);
      expect(_user.profile.firstName).to.equal(user.profile.firstName);
      expect(_user.profile.lastName).to.equal(user.profile.lastName);
      done();
    }).catch(err => done(err));
  });

  it('can verify password', (done) => {
    User.findByEmail('test@test.com').then((_user) => {
      _user.verifyPassword(user.password, (err, verified) => {
        if (err) {
          done(err);
        }
        expect(verified).to.equal(true);
        done();
      });
    }).catch(err => done(err));
  });

  it('can be listed', (done) => {
    User.list().then((_users) => {
      expect(_users).to.be.an('array');
      expect(_users).to.have.lengthOf(1);
      done();
    }).catch(err => done(err));
  });
});
