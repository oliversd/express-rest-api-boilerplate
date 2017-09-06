import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * RefreshToken Schema
 */
const permissionSchema = new mongoose.Schema({
  _role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  _resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  allowed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Permission = mongoose.model('Permission', permissionSchema, 'permissions');

export default Permission;
