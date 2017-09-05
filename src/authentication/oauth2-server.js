import oauth2orize from 'oauth2orize';
import passport from 'passport';
import crypto from 'crypto';

// Models
import User from '../models/user';
import AccessToken from '../models/accesstoken';
import RefreshToken from '../models/refreshtoken';

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
  const errorHandler = errFn.bind(undefined, done);

  const accessTokenValue = crypto.randomBytes(32).toString('hex');
  const refreshTokenValue = crypto.randomBytes(32).toString('hex');

  const dataAccessToken = Object.assign(data, { token: accessTokenValue });
  const accessToken = new AccessToken(dataAccessToken);

  const dataRefreshToken = Object.assign(data, { token: refreshTokenValue });
  const refreshToken = new RefreshToken(dataRefreshToken);

  refreshToken.save(errorHandler);

  accessToken.save().then(() => done(null, accessTokenValue, refreshTokenValue, {
    expires_in: process.env.TOKEN_EXPIRATION_TIME || 3600
  })).catch(done);
}
/**
 * Access Token Exchange
 */
aserver.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      done(err);
    } else if (!user) {
      done(null, false);
    } else {
      user.verifyPassword(password, (error, isMatch) => {
        if (error) {
          done(error);
        } else if (!isMatch) {
          done(null, false);
        } else {
          const model = {
            _client: client._id,
            _user: user._id
          };
          generateTokens(model, done);
        }
      });
    }
  });
}));

/**
 * Refresh token exchange
 */
aserver.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  RefreshToken.findOne({ token: refreshToken, _client: client._id })
    .populate('_user').exec((err, token) => {
      if (err) {
        done(err);
      } else if (!token) {
        done(null, false);
      } else if (!token._user) {
        done(null, false);
      } else {
        const _user = Object.assign({}, token._user._doc);
        delete _user.password;
        const model = {
          _client: client._id,
          _user: token._user._id
        };
        generateTokens(model, done);
      }
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
  aserver.errorHandler()
];
