import { NextFunction, Request, Response } from "express";
import { ProductModel } from "../models/products";
import { PurchaseModel } from "../models/purchase";

const mongoose = require("mongoose");

export const purchaseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { productId } = req.body;
    const { address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is missing" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "productId does not exist in database",
      });
    }

    const payload = {
      userId,
      productId,
      address,
      rate: -1,
    };
    const purchase = await PurchaseModel.create(payload);

    return res.status(200).json({
      success: true,
      message: "Purchase is completed",
      purchase,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Purchase failed",
      error,
    });
  }
};

// export const getProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     try {
//     const { id } = req.body;
//     if (id){
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Invalid ownerId' });
//       }
//     }
//     const payload = id ? {ownerId: id} : {};

//     const products = await ProductModel.find(payload)

//     return res.status(200).json({
//       success: true,
//       message: "Products fetched",
//       products
//     });

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Product creation failed",
//       error,
//     });
//   }

// };
