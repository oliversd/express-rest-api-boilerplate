import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * RefreshToken Schema
 */
const refreshTokenSchema = new mongoose.Schema({
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
  token: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');

export default RefreshToken;
