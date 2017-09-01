import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * RefreshToken Schema
 */
const RefreshTokenSchema = new mongoose.Schema({
  userId: {
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
}, {
  timestamps: true
});

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema, 'refreshTokens');

export default RefreshToken;
