import { Types } from "mongoose";

export enum Category {
  Sadaqah = "Sadaqah",
  Zakat = "Zakat",
}

export enum Campaign {
  // SG = "Save Gaza",
  // FR = "Flood Relief",
  // IP = "Islamic Preaching",
  BAM = "Build A Mosque",
  DAE = "Disaster And Emergency",
  WFA = "Water For All",
  SAO = "Sponsor An Orphan",
  H = "Homeless",
  UP = "UK Projects",
  E = "Eid",
  R = "Ramadan",
  HA = "Hunger Appeal"
}

export enum CampaignImage {
  // SG = "Save Gaza",
  // FR = "Flood Relief",
  // IP = "Islamic Preaching",
  BAM = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008660/mosque_sx7gh7.svg",
  DAE = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008656/emergency_ispe9r.svg",
  WFA = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008655/water-drop_uy1xst.svg",
  SAO = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008723/sponsor-orphan_twjzxf.svg",
  H = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008727/homeless_al4ms5.svg",
  UP = "https://res.cloudinary.com/dude3b6as/image/upload/v1730010343/uk-projects_clbtas.svg",
  E = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008751/eid_imjk6p.svg",
  R = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008756/ramadan_qtnilu.svg",
  HA = "https://res.cloudinary.com/dude3b6as/image/upload/v1730008812/hunger-appeal_wbj30l.svg"
}

export interface Appeal {
  _id: string;
  title: string;
  description: string;
  targeted_amount: number;
  collected_amount: number;
  category: Category;
  campaign: Campaign;
  campaignImage: CampaignImage
  start_date: Date;
  end_date: Date;
  image: string;
  author: Types.ObjectId;
  total_supporters: number;
}
