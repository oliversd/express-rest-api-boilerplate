import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * AccessToken Schema
 */
// TODO: add validations
const accessTokenSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  /*username: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },*/
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
}, { timestamps: true });

// Define AccessToken
const AccessToken = mongoose.model('AccessToken', accessTokenSchema, 'accessTokens');

export default AccessToken;
