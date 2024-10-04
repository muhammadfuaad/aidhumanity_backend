import { Types } from "mongoose";

export enum Category {
  Sadaqah = "Sadaqah",
  Zakat = "Zakat",
}

export enum Campaign {
  SaveGaza = "Save Gaza",
  FloodRelief = "Flood Relief",
  IslamicPreaching = "Islamic Preaching",
}

export interface Appeal {
  _id: string;
  title: string;
  description: string;
  targeted_amount: number;
  collected_amount: number;
  category: Category;
  campaign: Campaign;
  start_date: Date;
  end_date: Date;
  image: string;
  author: Types.ObjectId;
  total_supporters: number;
}
