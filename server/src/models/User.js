const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: null },
    verified: { type: Boolean, default: false },
    name: String,
    phone: String,
    location: String,
    farmSize: String,
    specialization: String,
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);
