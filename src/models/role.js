import mongoose from 'mongoose';
//
mongoose.Promise = global.Promise;
/**
 * RoleSchema Schema
 */
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    enum: ['USER', 'ADMIN'],
    required: true
  }
}, { timestamps: true });

const RoleSchema = mongoose.model('Role', roleSchema, 'roles');

export default RoleSchema;
