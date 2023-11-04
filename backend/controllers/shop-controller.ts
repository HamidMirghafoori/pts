import { NextFunction, Request, Response } from "express";
import { ProductModel, ProductType } from "../models/products";
import { PurchaseModel } from "../models/purchase";
import { RevenueModel } from "../models/revenue";
import { BusinessUserModel, UserModel } from "../models/user";

const mongoose = require("mongoose");

export const purchaseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('purchaseItem....');
  
  try {
    const { userId } = req.body;
    const { productId } = req.body;
    const { address } = req.body;
    const { quantity } = req.body;
    const { customerEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is missing" });
    }

    if (!customerEmail) {
      return res.status(400).json({ message: "customerEmail is missing" });
    }
    if (!quantity) {
      return res.status(400).json({ message: "quantity is missing" });
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

    const revenuePayload = {
      shopId: product.ownerId,
      shopEmail: product.shopEmail,
      customerId: userId,
      customerEmail: customerEmail,
      productId: product._id,
      productName: product.title,
      price: product.price,
      quantity,
    };
    const revenue = await RevenueModel.create(revenuePayload);

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

// Return all the purchased products by the customer
export const getPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    console.log("getPurchases....");

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const payload = {
      userId,
    };
    const purchasesRes = await PurchaseModel.find(payload).lean();

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

        // TODO: add rate and votes need to be added to the response based on purchases info
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
    console.log('rating....', userId, productId, purchaseId, rate);
    
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

export const addRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity } = req.body; 
    const { customerEmail } = req.body;  
    const { productId } = req.body; 
    const { customerId } = req.body; 
    const { productName } = req.body;  
    const { shopId } = req.body; 
    const { shopEmail } = req.body; 
    const { price } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "shopId userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "customerId productId" });
    }
    if (!shopEmail) {
      return res.status(400).json({ message: "shopEmail is missing" });
    }
    if (!customerEmail) {
      return res.status(400).json({ message: "customerEmail is missing" });
    }
    if (!quantity) {
      return res.status(400).json({ message: "quantity is missing" });
    }
    if (!productName) {
      return res.status(400).json({ message: "productName is missing" });
    }
    if (!price) {
      return res.status(400).json({ message: "price is missing" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "productId does not exist in database",
      });
    }
    const customer = await UserModel.findById(customerId);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "customerId does not exist in database",
      });
    }
    const shop = await BusinessUserModel.findById(shopId);
    if (!shop) {
      return res.status(401).json({
        success: false,
        message: "shopId does not exist in database",
      });
    }

    const payload = {
      shopId,
      shopEmail,
      customerId,
      customerEmail,
      productId,
      productName,
      price,
      quantity,
    };
    const revenue = await RevenueModel.create(payload);

    return res.status(200).json({
      success: true,
      message: "Revenue is added",
      revenue,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Revenue creation failed",
      error,
    });
  }
};
