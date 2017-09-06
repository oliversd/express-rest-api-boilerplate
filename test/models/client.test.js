import chai from 'chai';
import mongoose from 'mongoose';
import Client from '../../src/models/client';
import logger from '../../src/helpers/logger';

const expect = chai.expect;

const dbURI = process.env.MONGO_URI || 'mongodb://localhost/testApiDb';

mongoose.Promise = global.Promise;

let client = {
  name: 'testclient'
};

describe('Client spec for a model', () => {
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
    Client.remove().exec();
    mongoose.connection.close().catch(err => logger.error(err));
  });

  it('can be saved', (done) => {
    new Client(client).save().then((_client) => {
      expect(_client.name).to.equal(client.name);
      Client.encryptSecret(_client._id, (err) => {
        if (err) {
          done(err);
        }
        client = _client;
        done();
      });
    }).catch(done);
  });

  it('can verify secret', (done) => {
    Client.findOne({ id: client.id }).then((_client) => {
      _client.verifySecret(client.secret, (err, verified) => {
        if (err) {
          done(err);
        }
        expect(verified).to.equal(true);
        done();
      });
    }).catch(done);
  });

  it('can be found by _id', (done) => {
    Client.findById(client._id).then((_client) => {
      expect(_client._id.toString()).to.equal(client._id.toString());
      done();
    }).catch(done);
  });

  it('can be listed', (done) => {
    Client.list().then((_clients) => {
      expect(_clients).to.be.an('array');
      expect(_clients).to.have.lengthOf(1);
      done();
    }).catch(done);
  });
});
