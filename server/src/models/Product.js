const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    batchCode: { type: String, required: true, unique: true },
    harvestDate: { type: Date, required: true },
    description: String,
    category: String,
    availableUnits: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, required: true },
    images: [String],
    shelfLife: String,
    qualityGrade: String,
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('Product', ProductSchema);
