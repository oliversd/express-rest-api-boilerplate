import mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt';

mongoose.Promise = global.Promise;

/**
 * Client Mongoose Schema
 * Used for oauth2 authentication
 * @type {Mongoose Schema}
 */
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  secret: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
}, { timestamps: true });

/**
 * Methods
 */
clientSchema.method({
  verifySecret(secret, callback) {
    bcrypt.compare(secret, this.secret, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      return callback(null, isMatch);
    });
  }
});

/**
 * ClientSchem Static Methods
 */
clientSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The UUID or ObjectId of user.
   * @returns {Promise<User, APIError>}
   */
  findById(id) {
    return this.findOne({
      $or: [{  // eslint-disable-line no-use-before-define
        _id: id
      }, { id }]
    }).select({ secret: 0 }).exec(); // always filter the secret field
  },
  /**
   * List clients  in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of clients to be skipped.
   * @param {number} limit - Limit number of clients to be returned.
   * @returns {Promise<User[]>}
   */
  list({ query = {}, sort = { _id: -1 }, skip = 0, limit = 50 } = {}) {
    return this.find(query)
      .select({ secret: 0 }) // always filter the secret field
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

// Define Client
const Client = mongoose.model('Client', clientSchema, 'clients');

export default Client;
