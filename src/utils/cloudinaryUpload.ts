import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";

// @ts-ignore
const cloudinaryUpload = async (files) => {
  console.log("files:", files);
  // const files = request.files as {
  //   [fieldName: string]: Express.Multer.File[];
  // };

  const productImageMimeType = files.productImage[0].mimetype.split("/").at(-1);
  const fileName = files.productImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  console.log("fileName:", fileName);
  console.log("mimeType:", productImageMimeType);
  console.log("files:", files);

  // Upload the file to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    format: productImageMimeType,
  });
  console.log("uploadResult:", uploadResult);

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.log("error:", error);
  }

  const { secure_url } = uploadResult;
  return secure_url;
};

export default cloudinaryUpload;
