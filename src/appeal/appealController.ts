import { NextFunction, Request, Response } from "express";
import appealModel from "./appealModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import cloudinaryUpload from "../utils/cloudinaryUpload";
import { request } from "node:http";

const createAppeal = async (request: Request, response: Response) => {
  try {
    const { name, price, stock } = request.body;
    // Log the request body and files to debug
    console.log("Request body:", request.body);
    console.log("Request files:", request.files);

    const secure_url = cloudinaryUpload(request.files);

    const _request = request as AuthRequest;
    console.log("_request.userId:", _request.userId);

    // If you want to create the appeal after the image is uploaded:
    // const { name, price, stock } = request.body;
    const newAppeal = await appealModel.create({
      name,
      price,
      stock,
      owner: _request.userId,
      appealImage: (await secure_url) as string,
    });

    response.status(201).json({
      message: "Appeal created successfully",
      data: newAppeal,
      // uploadResult,
    });
  } catch (error) {
    console.error("Error creating appeal:", error);
    response.status(500).json({
      message: "Error creating appeal",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteAppeal = async (request: Request, response: Response, next: NextFunction) => {
  const _request = request as AuthRequest;
  console.log("_request.userId:", _request.userId);

  try {
    const appeal = await appealModel.findOne({ _id: request.params.id });

    if (!appeal) {
      return response.status(404).json({ message: "Appeal not found" });
    }
    if (appeal.author.toString() !== _request.userId) {
      return next(createHttpError(403, "You can't delete other's appeals"));
    }

    const result = await appealModel.deleteOne({ _id: request.params.id });

    response.json({
      message: "Appeal deleted successfully",
      deletedAppeal: appeal,
      result,
    });
  } catch (error) {
    console.error("Error deleting appeal:", error);
    response.status(500).json({
      message: "Error deleting appeal",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateAppeal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const _request = request as AuthRequest;
  console.log("_request.userId:", _request.userId);
  try {
    const appeal = await appealModel.findOne({ _id: request.params.id });

    if (!appeal) {
      return response.status(404).json({ message: "Appeal not found" });
    }
    console.log('appeal.author:', appeal.author);

    if (appeal.author.toString() !== _request.userId) {
      return next(createHttpError(403, "You can't edit other's appeals"));
    }

    let updateAttributes = Object.keys(request.body).reduce(
      (acc: { [key: string]: any }, item: string) => {
        acc[item] = request.body[item];
        return acc;
      },
      {}
    );

    if (request.files && Object.keys(request.files).length > 0) {
      console.log("request.files:", request.files);
      console.log("request.files.length:", request.files.length);
      const secure_url = await cloudinaryUpload(request.files);
      updateAttributes = { ...updateAttributes, appealImage: secure_url };
      // console.log("request.body:", request.body);
      // console.log("request.files:", request.files);

      
    }
    const result = await appealModel.updateOne(
      { _id: request.params.id },
      { $set: updateAttributes }
    );

    response.json({
      message: "Appeal updated successfully",
      updatedAppeal: appeal,
      result,
    });

    // console.log('outside updateAttributes:', updateAttributes);
    
  } catch (error) {
    console.error("Error updating appeal:", error);
    response.status(500).json({
      message: "Error updating appeal",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const allAppeals = async (request: Request, response: Response) => {
  const appeals = await appealModel.find();
  console.log("appeals:", appeals);
  response.json({
    message: "Appeals fetched successfully",
    data: appeals,
  });
};

const allCampaigns = async (request: Request, response: Response) => {
  const appeals = await appealModel.find();
  console.log("appeals:", appeals);
  const campaigns = [...new Set(appeals.map((item) => item.campaign))];
  response.json({
    message: "Campaigns fetched successfully",
    data: campaigns,
  });
};


const userAppeals = async (request: Request, response: Response) => {
  const appeals = await appealModel.find();
  console.log("appeals:", appeals);
  response.json({
    message: "Appeals fetched successfully",
    data: appeals,
  });
};

const getSingleAppeal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('request:', request);
  console.log("request.params:", request.params);
  const { appealId } = request.params;
  console.log("appealId:", appealId);

  try {
    const appeal = await appealModel.findOne({ _id: appealId });
    console.log("appeal:", appeal);

    if (!appeal) {
      return createHttpError(404, "Appeal not found");
    }

    response.json({
      message: "Appeal fetched successfully",
      data: appeal,
    });
  } catch (error) {
    console.log("error:", error);
    return next(createHttpError(500, "Error while getting appeal"));
  }
};

export {
  createAppeal,
  deleteAppeal,
  updateAppeal,
  allAppeals,
  allCampaigns,
  getSingleAppeal,
  userAppeals
};
