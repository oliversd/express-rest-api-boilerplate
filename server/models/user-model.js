import mongoose from 'mongoose';
import { debugDb } from '../config/debug';

/**
 * User Mongoose Schema
 * A user can have multiple email accounts and
 * multiples "services" (email/password, facebook, twitter, etc)
 * @type {Mongoose Schema}
 */
const userSchema = new mongoose.Schema({
  emails: {
    address: {
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
    default: Boolean
  },
  profile: {
    firstName: String,
    lastName: String
  },
  services: {
    type: [Object]
  },
  lastLogin: Date
},
  {
    timestamps: true
  }
);

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
    return this.findOne({ 'emails.$.address': email })
      .exec()
      .then((user) => {
        debugDb(user);
        return user;
      })
      .catch(err => err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

const User = mongoose.model('User', userSchema, 'users');

export default User;
