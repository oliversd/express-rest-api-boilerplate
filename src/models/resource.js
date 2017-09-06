import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * Resource Schema
 */
const resourceSchema = new mongoose.Schema({
  route: {
    type: String,
    unique: true,
    required: true
  },
  method: {
    type: String,
    unique: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    required: true,
    default: 'GET'
  }
}, { timestamps: true });

resourceSchema.index({ route: 1, method: 1 }, { unique: true });

const Resource = mongoose.model('Resource', resourceSchema, 'resources');

export default Resource;
