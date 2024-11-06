// appealTypes.ts:

export enum Campaign {
  E = "Eid",
  R = "Ramadan",
  HA = "Hunger Appeal"
}

export interface Appeal {
  _id: string;
  title: string;
  campaign: Campaign;
}

// appealModel.ts:

const appealSchema = new mongoose.Schema<Appeal>(
  {
    title: {
      type: String,
      required: true,
    },
    campaign: {
      type: String,
      enum: Object.values(Campaign),
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Appeal>('Appeal', appealSchema)

// appealController.ts:
const createAppeal = async (request: Request, response: Response) => {
  try {
    const { title, campaign} = request.body;
    // Log the request body and files to debug
    console.log("Request body:", request.body);
    console.log("Request files:", request.files);

    const newAppeal = await appealModel.create({
      title, campaign
    });

    response.status(201).json({
      message: "Appeal created successfully",
      data: newAppeal,
    });
  } catch (error) {
    console.error("Error creating appeal:", error);
    response.status(500).json({
      message: "Error creating appeal",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
