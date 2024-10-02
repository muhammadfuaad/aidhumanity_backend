import { Types } from "mongoose";

export enum Category {
  Sadaqah = "Sadaqah",
  Zakat = "Zakat",
}

export enum Campaign {
  SaveGaza = "Save Gaza",
  FloodRelief = "Flood Relief"
}

export interface Appeal {
  _id: string;
  title: string;
  description: string;
  targeted_amount: number;
  collected_amount: number;
  category: Category;
  campaign: string;
  start_date: Date;
  end_date: Date;
  image: string;
  author: Types.ObjectId;
}
