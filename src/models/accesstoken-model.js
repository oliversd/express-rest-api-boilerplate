import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * AccessToken Schema
 */
// TODO: add validations
const AccessTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    default: () => {
      const today = new Date();
      // Expiration time in miliseconds (seconds * 1000) of our access token
      // default 3600 seconds => 60 minutes => 1 hour
      const expiration = (process.env.TOKEN_EXPIRATION_TIME || 3600) * 1000;
      return new Date(today.getTime() + expiration);
    }
  },
  token: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Define AccessToken
const AccessToken = mongoose.model('AccessToken', AccessTokenSchema, 'accessTokens');

export default AccessToken;
