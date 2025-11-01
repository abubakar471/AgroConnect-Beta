const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
    rejectionReason: String,
    acceptedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = model('Order', OrderSchema);
