import passport from 'passport';

import * as ClientPasswordStrategy from 'passport-oauth2-client-password';
import * as BearerStrategy from 'passport-http-bearer';
import Client from '../models/client';
import AccessToken from '../models/accesstoken';

passport.use(new ClientPasswordStrategy.Strategy((id, secret, done) => {
  Client.findOne({ id }, (err, client) => {
    if (err) { return done(err); }
    if (!client) { return done(null, false); }
    return client.verifySecret(secret, (errScrt, verified) => {
      if (errScrt) { return done(errScrt); }
      if (!verified) { return done(null, false); }
      return done(null, client);
    });
  });
}));

passport.use(new BearerStrategy.Strategy((accessToken, done) => {
  AccessToken.findOne({ token: accessToken }).populate('_user').exec((err, token) => {
    if (err) { return done(err); }
    if (token) {
      if (Math.round((Date.now() - token.createdAt) / 1000) > 7200) {
        AccessToken.remove({ token: accessToken }, (error) => {
          if (error) return done(error);
          return false;
        });
        return done(null, false, { message: 'Token expired' });
      } else if (!token._user) {
        return done(null, false, { message: 'Unknown user' });
      }
      const info = { scope: '*' };
      const _user = Object.assign({}, token._user._doc);
      delete _user.password;
      return done(null, _user, info);
    }
    return done(null, false);
  });
}));
