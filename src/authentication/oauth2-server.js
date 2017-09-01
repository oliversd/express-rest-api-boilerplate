import oauth2orize from 'oauth2orize';
import passport from 'passport';
import crypto from 'crypto';


// Models
import User from '../models/user-model';
import AccessToken from '../models/accesstoken-model';
import RefreshToken from '../models/refreshtoken-model';

// We create a Oauth2 server
const aserver = oauth2orize.createServer();

// Manejador de errores
const errFn = (cb, err) => { // eslint-disable-line
  if (err) {
    return cb(err);
  }
};

// Destruimos los viejos tokens y refreshtoken y generamos nuevos
function generateTokens(data, done) {
  const errorHandler = errFn.bind(undefined, done); // eslint-disable-line
  let datainfo = data; // eslint-disable-line prefer-const

  // RefreshToken.remove(data, errorHandler);
  // AccessToken.remove(data, errorHandler);

  const tokenValue = crypto.randomBytes(32).toString('hex');
  const refreshTokenValue = crypto.randomBytes(32).toString('hex');

  datainfo.token = tokenValue;
  const token = new AccessToken(datainfo);

  datainfo.token = refreshTokenValue;
  const refreshToken = new RefreshToken(datainfo);

  refreshToken.save(errorHandler);

  token.save()
  .then(() => done(null, tokenValue, refreshTokenValue, {
    expires_in: process.env.TOKEN_EXPIRATION_TIME || 3600
  })
  )
  .catch(error => done(error));
}
/**
 * Access Token Exchange
 */
aserver.exchange(oauth2orize.exchange.password((client, email, password, scope, done) => {
  User.findByEmail(email)
    .then((user) => { // eslint-disable-line consistent-return
      if (!user) {
        return done(null, false);
      }
      user.comparePassword(password, (error, isMatch) => {
        if (error) {
          return done(error);
        }
        if (!isMatch) {
          return done(null, false);
        }

        const model = {
          userId: user._id,
          clientId: client.id
        };

        return generateTokens(model, done);
      });
    }).catch(error => done(error));
}));

/**
 * Refresh token exchange
 */
aserver.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  RefreshToken.findOne({ token: refreshToken, clientId: client.id }, (err, token) => {
    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    User.findByEmail(token.email)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      const model = {
        email: user.email,
        clientId: client.id
      };

      generateTokens(model, done);
      return true;
    }).catch(error => done(error));

    return true;
  });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['oauth2-client-password'], { session: false }),
  aserver.token(),
  aserver.errorHandler(),
];
