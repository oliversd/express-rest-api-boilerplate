import mongoose from 'mongoose';
import uuid from 'uuid';
import { debugDb } from '../config/debug';

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
},
  {
    timestamps: true
  }
);

/**
 * ClientSchem Static Methods
 */
clientSchema.statics = {

  /**
   * Get client by id
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findOne({ id })
      .select({ _id: 0, __v: 0 })
      .exec()
      .then(client => client)
      .catch((error) => {
        debugDb('Client Schema Error', error);
        throw error;
      });
  },

  /**
   * List clients  in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of clients to be skipped.
   * @param {number} limit - Limit number of clients to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find({})
      .select({ __v: 0 }) // always filter the password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

// Define Client
const Client = mongoose.model('Client', clientSchema, 'clients');

export default Client;
