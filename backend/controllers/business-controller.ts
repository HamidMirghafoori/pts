import { NextFunction, Request, Response } from "express";
import { ProductModel } from "../models/products";
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
    const { bgImg } = req.body;
    const { ownerId } = req.body;
    const { shopEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: 'Invalid ownerId' });
    }
    const user = await BusinessUserModel.findById(ownerId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "ownerId of the business does not exist in database",
      });
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
      shopEmail
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

    const product = await ProductModel.create(payload);
      
    return res.status(200).json({
      success: true,
      message: "Product created",
      product
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
    if (id){
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ownerId' });
      }
    }
    const payload = id ? {ownerId: id} : {};

    const products = await ProductModel.find(payload)

    return res.status(200).json({
      success: true,
      message: "Products fetched",
      products
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

    const products = await ProductModel.find()

    return res.status(200).json({
      success: true,
      message: "All products fetched",
      products
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Product creation failed",
      error,
    });
  }

};
