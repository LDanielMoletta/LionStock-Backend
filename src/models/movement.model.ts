import mongoose, { Document, Schema } from 'mongoose';

export type MovementType = 'ENTRY' | 'EXIT';

export interface IMovement extends Document {
  product: mongoose.Types.ObjectId;
  type: MovementType;
  quantity: number;
  reason: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MovementSchema = new Schema<IMovement>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['ENTRY', 'EXIT'], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMovement>('Movement', MovementSchema);