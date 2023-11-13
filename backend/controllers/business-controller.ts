import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { Types } from "mongoose";
import { rootDir } from "..";
import { ProductModel, ProductType } from "../models/products";
import { PurchaseModel } from "../models/purchase";
import { BusinessUserModel } from "../models/user";
const fs = require("fs");

const mongoose = require("mongoose");

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const { category } = req.body;
    const { destination } = req.body;
    const { price } = req.body;
    const { tags } = req.body;
    const { offers } = req.body;
    let { bgImg } = req.body;
    const { ownerId } = req.body;
    const { productId } = req.body;
    const { shopEmail } = req.body;
    const { productDescription } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid ownerId" });
    }
    const user = await BusinessUserModel.findById(ownerId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "ownerId of the business does not exist in database",
      });
    }

    if (!title) {
      return res.status(401).send({ message: "title is missing" });
    }
    if (!bgImg) {
      return res.status(401).send({ message: "bgImg is missing" });
    }
    if (!category) {
      return res.status(401).send({ message: "category is missing" });
    }
    if (!destination) {
      return res.status(401).send({ message: "destination is missing" });
    }
    if (!ownerId) {
      return res.status(401).send({ message: "ownerId is missing" });
    }
    if (!shopEmail) {
      return res.status(401).send({ message: "shopEmail is missing" });
    }
    if (!price) {
      return res.status(401).send({ message: "price is missing" });
    }

    const payload = {
      title,
      category,
      destination,
      price,
      tags,
      offers,
      bgImg,
      ownerId,
      shopEmail,
      productDescription,
    };

    const product = productId
      ? await ProductModel.findById({ _id: productId })
      : undefined;
    let updateRes: any;
    if (!product) {
      updateRes = await ProductModel.create({ ...payload });
    } else {
      updateRes = await ProductModel.findOneAndUpdate(
        { _id: productId },
        { ...payload },
        { new: true, upsert: true }
      );
    }

    const image = req.files.file as fileUpload.UploadedFile;
    const imagePath = rootDir + "/public/" + image.name.split(" ").join("");
    bgImg = bgImg.split(" ").join("");

    image.mv(imagePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });

    return res.status(200).json({
      success: true,
      message: productId ? "Product created" : "Product updated",
      product: updateRes,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Product creation failed",
      error,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ownerId } = req.body;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res.status(400).json({ message: "Invalid ownerId" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }
  const product = await ProductModel.findOne({ _id: productId });

  if (product?.ownerId.toHexString() === ownerId) {
    ProductModel.findByIdAndDelete(productId)
      .then((removedDocument) => {
        if (removedDocument) {
          const imagePath =
            rootDir + "/public/" + removedDocument.bgImg.split(" ").join("");
          fs.unlink(imagePath, (err: any) => {
            if (err) {
              console.log("failed to delete ", removedDocument.bgImg);
            }
            console.log(removedDocument.bgImg, " deleted successfully.");
          });
          return res
            .status(200)
            .json({ message: "Product deleted successfully", status: true });
        } else {
          return res
            .status(404)
            .json({ message: "Product is not found", status: false });
        }
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
  } else {
    return res
      .status(403)
      .json({ message: "Product is not belong to you", status: false });
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ownerId" });
      }
    } else {
      return res.status(400).json({ message: "id is missing" });
    }
    const payload = id ? { ownerId: id } : {};

    const products = await ProductModel.find(payload);

    return res.status(200).json({
      success: true,
      message: "Products fetched",
      products,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Product creation failed",
      error,
    });
  }
};

interface ProductsExtended extends ProductType {
  rate: number;
  votes: number;
  bookedCount: number;
  currency: string;
}
interface RatingsType {
  _id: Types.ObjectId;
  ratings: number;
  count: number;
}
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products = (await ProductModel.find().lean()) as ProductsExtended[];
    products = products.map((product) => {
      return {
        ...product,
        rate: 0,
        votes: 0,
        bookedCount: 0,
        currency: "US$",
      };
    });
    console.log("getAllProducts....");

    const ratings = await PurchaseModel.aggregate([
      { $match: { rate: { $gte: 0 } } },
      {
        $group: {
          _id: "$productId",
          ratings: { $avg: "$rate" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 1, ratings: 1, count: 1 } },
    ]) as RatingsType[];

    for (let i = 0; i < products.length; i++) {
      let matchingObject = ratings.find(
        (obj) => obj._id.toHexString() === products[i]._id.toHexString()
      );

      if (matchingObject) {
        products[i].rate = matchingObject.ratings;
        products[i].votes = matchingObject.count;
      }
    }

    return res.status(200).json({
      success: true,
      message: "All products fetched",
      products,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Product creation failed",
      error,
    });
  }
};
