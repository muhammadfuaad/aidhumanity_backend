import mongoose from 'mongoose'
import { Appeal, Campaign, Category } from './appealTypes'

const appealSchema = new mongoose.Schema<Appeal>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the ObjectId of User
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targeted_amount: {
      type: Number,
      required: true,
    },
    collected_amount: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      // required: true,
    },
    end_date: {
      type: Date,
      // required: true,
    },
    category: {
      type: String,
      enum: Object.values(Category), // Use enum with possible values
      // required: true,
    },
    campaign: {
      type: String,
      enum: Object.values(Campaign), // Use enum with possible values
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Appeal>('Appeal', appealSchema)