/* import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../src/index';
import Client from '../src/models/client-model';

chai.config.includeStack = true;

let client = '';

let user = {
  email: 'test@test.cl',
  password: 'asdasd',
};

const authUser = {
  username: 'test@test.cl',
  password: 'asdasd',
  grant_type: 'password'
};

const _client = {
  name: 'Test Client'
};

let token = '';

let savedClient = '';

describe('## Client Endpoints', () => {
  before((done) => {
    request(app)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        user = res.body;
        done();
      });
  });
  before((done) => {
    const testClient = new Client({
      name: 'Client'
    });

    testClient.save()
    .then((result) => {
      savedClient = result;
      done();
    })
    .catch(error => done(error));
  });
  before((done) => {
    authUser.client_id = savedClient.id;
    authUser.client_secret = savedClient.secret;
    request(app)
      .post('/api/auth/oauth/token')
      .send(authUser)
      .expect(200)
      .end((err, res) => {
        token = 'Bearer ';
        token += res.body.access_token;
        done();
      });
  });
  after((done) => {
    try {
      if (mongoose.connection.db) {
        mongoose.connection.db.dropDatabase();
      }
      done();
    } catch (error) {
      done(error);
    }
  });

  describe('# POST /api/client', () => {
    it('should create a new client', (done) => {
      request(app)
        .post('/api/client')
        .set('Authorization', token)
        .send(_client)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal('ok');
          expect(res.body).to.have.property('client');
          expect(res.body.client).to.be.instanceof(Object);
          expect(res.body.client).to.have.property('id');
          expect(res.body.client).to.have.property('secret');
          client = res.body.client;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/client/:clientId', () => {
    it('should get client details', (done) => {
      request(app)
        .get(`/api/client/${client.id}`)
        .set('Authorization', token)
        .expect(200)
        .then((res) => {
          expect(res.body.client.id).to.equal(client.id);
          done();
        })
        .catch(done);
    });
    it('should report error with message - Not found, when client does not exists', (done) => {
      request(app)
        .get('/api/client/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', token)
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Client not found');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/client/', () => {
    it('should get all clients', (done) => {
      request(app)
        .get('/api/client')
        .set('Authorization', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
});
*/