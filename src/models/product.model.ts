import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);