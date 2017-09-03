import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import logger from '../helpers/logger';
import { debugMongo } from '../config/debug';

mongoose.Promise = global.Promise;

/**
 * User Mongoose Schema
 * A user can have multiple email accounts and
 * multiples "services" (email/password, facebook, twitter, etc)
 * @type {Mongoose Schema}
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    firstName: {
      type: String,
      default: null
    },
    lastName: {
      type: String,
      default: null
    }
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { timestamps: true });

/**
 * Middeware hooks
 */
userSchema.pre('save', function (next) { // eslint-disable-line func-names
  if (!this.isModified('password')) return next();
  return bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    return next();
  }).catch((err) => {
    throw new Error('Error with password hash', err);
  });
});
/**
 * Methods
 */
userSchema.method({
  verifyPassword(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      return callback(null, isMatch);
    });
  }
});
/**
 * Statics
 */
userSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  findByEmail(email) {
    return this.findOne({  // eslint-disable-line no-use-before-define
      email
    }).exec();
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ query = {}, sort = { _id: -1 }, skip = 0, limit = 50 } = {}) {
    return this.find(query)
      .select({ password: 0 }) // always filter the password field
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

// Define User
const User = mongoose.model('User', userSchema, 'users');

export default User;
