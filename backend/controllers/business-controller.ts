import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { rootDir } from "..";
import { ProductModel, ProductType } from "../models/products";
import { BusinessUserModel } from "../models/user";

const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;

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
    console.log(req.files);
    const image = req.files.file as fileUpload.UploadedFile;
    const imagePath = rootDir + "/public/" + image.name.split(" ").join("");
    bgImg = bgImg.split(" ").join("");
    console.log(image, imagePath);

    image.mv(imagePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // res.send('File uploaded!');
    });

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

    const product = await ProductModel.create(payload);

    return res.status(200).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Product creation failed",
      error,
    });
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
    console.log("payload", payload);

    const products = await ProductModel.find(payload);
    console.log(products);

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

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products = (await ProductModel.find().lean()) as ProductType[];
    products = products.map((product) => {
      return { ...product, rate: 0, votes: 0, bookedCount: 0, currency: "US$" };
    });
    console.log("getAllProducts....");

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
