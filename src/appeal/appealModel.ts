import mongoose from 'mongoose'
import { Appeal, Campaign, CampaignImage, Category } from './appealTypes'

const appealSchema = new mongoose.Schema<Appeal>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    targeted_amount: {
      type: Number,
      // required: true,
    },
    collected_amount: {
      type: Number,
      // required: true,
    },
    image: {
      type: String,
      // required: true,
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
      enum: Object.values(Category),
      // required: true,
    },
    campaign: {
      type: String,
      enum: Object.values(Campaign),
      // required: true,
    },
    campaignImage: {
      type: String,
      enum: Object.values(CampaignImage),
      // required: true,
    },
    total_supporters: Number
  },
  { timestamps: true }
);

export default mongoose.model<Appeal>('Appeal', appealSchema)