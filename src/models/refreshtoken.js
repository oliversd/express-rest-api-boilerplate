import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * RefreshToken Schema
 */
const refreshTokenSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');

export default RefreshToken;
