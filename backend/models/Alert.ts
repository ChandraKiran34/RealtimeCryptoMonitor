import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the alert document
interface IAlert extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  cryptoId: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema for the alert
const alertSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference type pointing to the User model
    ref: 'User',  // Reference to the User model
    required:true
  },
  cryptoId: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  direction: {
    type: String,
    required: true,
    enum: ['above', 'below'], // Validating that direction is either 'above' or 'below'
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the model from the schema and interface
export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
