import passport from 'passport';
// import { BasicStrategy } from 'passport-http';

import * as ClientPasswordStrategy from 'passport-oauth2-client-password';
import * as BearerStrategy from 'passport-http-bearer';

import User from '../models/user';
import Client from '../models/client';
import AccessToken from '../models/accesstoken';


/**
 passport.use(new BasicStrategy((id, secret, done) => {
  Client.findOne({ id }, (err, client) => {
    if (err) { return done(err); }
    if (!client) { return done(null, false); }
    return client.verifySecret(secret, (errScrt, verified) => {
      if (errScrt) { return done(errScrt); }
      if (!verified) { return done(null, false); }
      return done(null, client);
    });
    // if (client.secret !== secret) { return done(null, false); }
    // return done(null, client);
  });
}));
*/

passport.use(new ClientPasswordStrategy.Strategy((id, secret, done) => {
  Client.findOne({ id }, (err, client) => {
    if (err) { return done(err); }
    if (!client) { return done(null, false); }
    /** ** ** ** ** ** ** ** ** **/
    return client.verifySecret(secret, (errScrt, verified) => {
      if (errScrt) { return done(errScrt); }
      if (!verified) { return done(null, false); }
      return done(null, client);
    });
    /** ** ** ** ** ** ** ** ** **/
    // if (client.secret !== secret) { return done(null, false); }
    // return done(null, client);
  });
}));

passport.use(new BearerStrategy.Strategy((accessToken, done) => {
  AccessToken.findOne({ token: accessToken }, (err, token) => {
    if (err) { return done(err); }
    if (token) {
      /* if( Math.round((Date.now()-token.created)/1000) > config.get('tokenLife') ) { */
      if (Math.round((Date.now() - token.createdAt) / 1000) > 7200) {
        AccessToken.remove({ token: accessToken }, (error) => {
          if (error) return done(error);
          return false;
        });
        return done(null, false, { message: 'Token expired' });
      }

      User.findOne({ email: token.username }, (errorUser, user) => {
        if (errorUser) { return done(errorUser); }
        if (!user) { return done(null, false, { message: 'Unknown user' }); }
        const info = { scope: '*' };

        return done(null, user, info);
      });
    } else {
      return done(null, false);
    }
    return false;
  });
}));
