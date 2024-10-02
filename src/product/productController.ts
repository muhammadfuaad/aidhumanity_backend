import { NextFunction, Request, Response } from "express";
import productModel from "./productModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import cloudinaryUpload from "../utils/cloudinaryUpload";

const createProduct = async (request: Request, response: Response) => {
  try {
    const { name, price, stock } = request.body;
    // Log the request body and files to debug
    console.log("Request body:", request.body);
    console.log("Request files:", request.files);

    const secure_url = cloudinaryUpload(request.files);

    const _request = request as AuthRequest;
    console.log("_request.userId:", _request.userId);

    // If you want to create the product after the image is uploaded:
    // const { name, price, stock } = request.body;
    const newProduct = await productModel.create({
      name,
      price,
      stock,
      owner: _request.userId,
      productImage: (await secure_url) as string,
    });

    response.status(201).json({
      message: "Product created successfully",
      data: newProduct,
      // uploadResult,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    response.status(500).json({
      message: "Error creating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteProduct = async (request: Request, response: Response, next: NextFunction) => {
  const _request = request as AuthRequest;
  console.log("_request.userId:", _request.userId);

  try {
    const product = await productModel.findOne({ _id: request.params.id });

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }
    if (product.owner.toString() !== _request.userId) {
      return next(createHttpError(403, "You can't delete other's products"));
    }

    const result = await productModel.deleteOne({ _id: request.params.id });

    response.json({
      message: "Product deleted successfully",
      deletedProduct: product,
      result,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    response.status(500).json({
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const _request = request as AuthRequest;
  console.log("_request.userId:", _request.userId);
  try {
    const product = await productModel.findOne({ _id: request.params.id });

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }
    console.log('product.owner:', product.owner);

    if (product.owner.toString() !== _request.userId) {
      return next(createHttpError(403, "You can't edit other's products"));
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
      updateAttributes = { ...updateAttributes, productImage: secure_url };
      // console.log("request.body:", request.body);
      // console.log("request.files:", request.files);

      
    }
    const result = await productModel.updateOne(
      { _id: request.params.id },
      { $set: updateAttributes }
    );

    response.json({
      message: "Product updated successfully",
      updatedProduct: product,
      result,
    });

    // console.log('outside updateAttributes:', updateAttributes);
    
  } catch (error) {
    console.error("Error updating product:", error);
    response.status(500).json({
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const allProducts = async (request: Request, response: Response) => {
  const products = await productModel.find();
  console.log("products:", products);
  response.json({
    message: "Products fetched successfully",
    data: products,
  });
};

const userProducts = async (request: Request, response: Response) => {
  const products = await productModel.find();
  console.log("products:", products);
  response.json({
    message: "Products fetched successfully",
    data: products,
  });
};

const getSingleProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("request.params:", request.params);
  const { productId } = request.params;
  console.log("productId:", productId);

  try {
    const product = await productModel.find({ _id: productId });
    console.log("product:", product);

    if (!product) {
      return createHttpError(404, "Product not found");
    }

    response.json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log("error:", error);
    return next(createHttpError(500, "Error while getting product"));
  }
};
export {
  createProduct,
  deleteProduct,
  updateProduct,
  allProducts,
  getSingleProduct,
};
