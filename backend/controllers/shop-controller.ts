import { NextFunction, Request, Response } from "express";
import { ProductModel, ProductType } from "../models/products";
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

export const getPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const payload = {
      userId,
    };
    const purchasesRes = await PurchaseModel.find(payload, {
      // _id: { $toString: "$_id" },
    }).lean();

    const productIds = purchasesRes.map((purchase) => purchase.productId);
    const purchaseIds = new Map(
      purchasesRes.map((purchase) => [
        purchase.productId.toHexString(),
        purchase._id.toHexString(),
      ])
    );

    const productsRes = (await ProductModel.find({
      _id: { $in: productIds },
    }).lean()) as ProductType[];
    const products = productsRes.map((product: any) => {
      return {
        ...product,
        purchaseId: purchaseIds.get(product._id.toHexString()),
      };
    });
    return res.status(200).json({
      success: true,
      message: "list of purchases",
      products,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Purchase failed",
      error,
    });
  }
};

export const getSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sales = await ProductModel.find();

    return res.status(200).json({
      success: true,
      message: "list of sales",
      sales,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Sales list failed",
      error,
    });
  }
};

export const ratePurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { productId } = req.body;
    const { purchaseId } = req.body;
    const { rate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return res.status(400).json({ message: "Invalid purchaseId" });
    }
    if (!rate) {
      return res.status(400).json({ message: "rate is missing" });
    }

    const purchase = await PurchaseModel.find({ _id: purchaseId });
    console.log(purchase);

    if (purchase.length < 1) {
      return res.status(404).json({
        success: false,
        message: "purchase not found",
      });
    }

    if (
      purchase[0].userId.toHexString() !== userId ||
      purchase[0].productId.toHexString() !== productId
    ) {
      console.log(purchase[0]);
      return res.status(404).json({
        success: false,
        message:
          "provided userId or productId is not matching with the purchase",
      });
    }

    const updateRes = await PurchaseModel.findOneAndUpdate(
      { _id: purchaseId },
      { rate },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "product rated successfully",
      purchase: updateRes,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "rating failed",
      error,
    });
  }
};
