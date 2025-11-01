const { Schema, model } = require('mongoose');

const VerificationRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nidFrontUrl: String,
    nidBackUrl: String,
    farmVideoUrl: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedAt: Date,
    reviewedBy: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = model('VerificationRequest', VerificationRequestSchema);
