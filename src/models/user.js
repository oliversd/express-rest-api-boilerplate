import mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';

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
  reset: {
    token: {
      type: String,
      default: null
    },
    expires: {
      type: Date,
      default: null
    }
  },
  password: {
    type: String,
    required: true
  },
  changePassword: {
    type: Boolean,
    default: false
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
  if (this.isModified('password') || this.isModified('reset')) {
    if (this.isModified('password')) {
      return bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;
        return next();
      }).catch(next);
    }
    if (this.isModified('reset') && this.reset.token) {
      return bcrypt.hash(this.reset.token, 10).then((hash) => {
        this.reset.token = hash;
        return next();
      }).catch(next);
    }
    return next();
  }
  return next();
});
/**
 * Methods
 */
userSchema.method({
  verifyPassword(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        callback(err);
      } else {
        callback(null, isMatch);
      }
    });
  },
  forgotPassword(callback) {
    const today = new Date();
    const expiration = new Date(today.getTime() + (10 * 60 * 1000));
    const resetToken = uuid.v4();
    this.reset.expires = expiration;
    this.reset.token = resetToken;
    this.markModified('reset');
    this.save((err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, resetToken);
      }
    });
  },
  resetPassword(token, callback) {
    const that = this;
    if (new Date().getTime() > this.reset.expires.getTime()) {
      callback(new Error('Token expired'));
    } else {
      bcrypt.compare(token, this.reset.token, (err, isMatch) => {
        if (err) {
          callback(err);
        } else if (isMatch) {
          const password = randomstring.generate(12);
          that.password = password;
          that.changePassword = true;
          that.save((_err) => {
            if (_err) {
              callback(_err);
            } else {
              callback(null, password);
            }
          });
        }
      });
    }
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
  findById(_id) {
    return this.findOne({  // eslint-disable-line no-use-before-define
      _id
    })
      .select({ password: 0 }) // always filter the password field
      .exec();
  },
  /**
   * Get user
   * @param {ObjectId} email - The email of user.
   * @returns {Promise<User, APIError>}
   */
  findByEmail(email) {
    return this.findOne({  // eslint-disable-line no-use-before-define
      email
    })
      .select({ password: 0 }) // always filter the password field
      .exec();
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
