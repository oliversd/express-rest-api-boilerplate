import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { debugDb } from '../config/debug';

mongoose.Promise = global.Promise;

/**
 * User Mongoose Schema
 * A user can have multiple email accounts and
 * multiples "services" (email/password, facebook, twitter, etc)
 * @type {Mongoose Schema}
 */
const userSchema = new mongoose.Schema({
  emails: [
    {
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
    }
  ],
  password: String,
  profile: {
    firstName: String,
    lastName: String
  },
  services: {
    type: Array,
    default: []
  },
  lastLogin: Date
},
  {
    timestamps: true
  }
);

// Pre save function
userSchema.pre('save', function (next) { // eslint-disable-line func-names
  User.find({ 'emails.address': this.emails[0].address }).exec().then((user) => { // eslint-disable-line no-use-before-define
    if (user.length > 0) {
      // Here we don't return user already exist for security reasons
      next(new Error('Could not complete the request'));
    } else {
      bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;
        return next();
      }).catch((err) => {
        throw new Error('Error with password hash', err);
      });
    }
  });
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
    return this.findOne({ 'emails.address': email })
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
    return this.find({})
      .select({ password: 0 }) // always filter the password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

// Define User
const User = mongoose.model('User', userSchema, 'users');

export default User;
