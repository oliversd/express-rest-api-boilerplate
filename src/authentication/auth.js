import passport from 'passport';
// import { BasicStrategy } from 'passport-http';

import * as ClientPasswordStrategy from 'passport-oauth2-client-password';
import * as BearerStrategy from 'passport-http-bearer';

import User from '../models/user-model';
import Client from '../models/client-model';
import AccessToken from '../models/accesstoken-model';

/* passport.use(new BasicStrategy((clientId, clientSecret, done) => {
  console.log('Basic Strategy');
  Client.findOne({ id: clientId }, (err, client) => {
    if (err) {
      return done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.secret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
  });
}));
*/

passport.use(new ClientPasswordStrategy.Strategy(
  (id, secret, done) => {
    Client.findOne({ id })
    .exec()
    .then((client) => {
      if (!client) {
        return done(null, false);
      }
      if (client.secret !== secret) {
        return done(null, false);
      }
      return done(null, client);
    }).catch(error => done(error));
  }
));

passport.use(new BearerStrategy.Strategy(
  (accessToken, done) => {
    AccessToken.findOne({ token: accessToken }, (err, token) => {
      if (err) {
        return done(err);
      }
      if (token) {
        if (Math.round(Date.now() - token.createdAt) > 7200000) {
          AccessToken.remove(accessToken, (error) => {
            if (error) return done(error);
            return false;
          });
          return done(null, false, { message: 'Token expired' });
        }
        User.findOne({ email: token.email }, (errorUser, user) => {
          if (errorUser) {
            return done(errorUser);
          }
          if (!user) {
            return done(null, false, { message: 'Unknown user' });
          }
          const info = { scope: '*' };
          return done(null, user, info);
        });
      } else {
        return done(null, false);
      }
      return false;
    });
  }
));
