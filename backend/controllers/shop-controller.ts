import { NextFunction, Request, Response } from "express";
import { ProductModel, ProductType } from "../models/products";
import { PurchaseModel } from "../models/purchase";
import { RevenueModel } from "../models/revenue";
import { BusinessUserModel, UserModel } from "../models/user";

const mongoose = require("mongoose");
interface MonthType {
  [key: string]: number;
}

const emptySales: MonthType = {
  Jan: 0,
  Feb: 0,
  Mar: 0,
  Apr: 0,
  May: 0,
  Jun: 0,
  Jul: 0,
  Aug: 0,
  Sep: 0,
  Oct: 0,
  Nov: 0,
  Dec: 0,
};

const monthEnum: { [key: number]: string } = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

type MType =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export const purchaseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("purchaseItem....");

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
    console.log("rating....", userId, productId, purchaseId, rate);

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
      // console.log(purchase[0]);
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
      return res.status(400).json({ message: "Invalid shopId" });
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

export const getShopReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shopId } = req.body;

  if (shopId && !mongoose.Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({ message: "Invalid shopId" });
  }
  if (shopId) {
    const shop = await BusinessUserModel.findById(shopId);

    if (!shop) {
      return res.status(401).json({
        success: false,
        message: "shopId does not exist in database",
      });
    }
  }

  const soldItems = shopId
    ? await RevenueModel.find({ shopId })
    : await RevenueModel.find();
  // console.log(soldItems[0], soldItems.length);
  interface ProductType {
    productId: string;
    title: string;
    count: number;
  }
  const productsIds: string[] = Array.from(
    new Set(soldItems.map((item) => item.productId.toHexString()))
  );

  const shopIds: string[] = Array.from(
    new Set(soldItems.map((item) => item.shopId.toHexString()))
  );

  const shopsInfo = shopIds.reduce((result, shopId) => {
    const email = soldItems.find((item) => item.shopId.toHexString() === shopId)
      ?.shopEmail as string;

    result.push({shopId, email});


    return result;
  }, [] as { shopId: string, email: string }[]);

  //fetch products prices
  let pricesArray = await (
    await ProductModel.find({ _id: { $in: productsIds } })
  ).map((product) => {
    return { [product._id.toHexString()]: product.price, title: product.title };
  });
  const prices: any = {};
  const productsNames: any = {};

  pricesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];
    prices[key] = obj[key];
  });

  pricesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];
    productsNames[key] = obj["title"];
  });

  // console.log("productsNames", productsNames);

  // const products = productsIds.reduce((p,c)=> (p['productId']=c, p['title']="", p), {})
  const products: ProductType[] = productsIds.map((id) => {
    const title = soldItems.filter(
      (item) => item.productId.toHexString() === id
    )[0].productName;
    return { productId: id, title, count: 0 };
  });
  for (let i = 0; i < products.length; i++) {
    products[i].count = soldItems.filter(
      (item) => item.productId.toHexString() === products[i].productId
    ).length;
  }
  // console.log(productsIds, products);
  const salesObj: MonthType = { ...emptySales };

  let min = new Date(2050, 1, 1);
  let max = new Date(1900, 1, 1);
  for (let i = 0; i < soldItems.length; i++) {
    if (soldItems[i].createdAt > max) {
      max = soldItems[i].createdAt;
    }
    if (soldItems[i].createdAt < min) {
      min = soldItems[i].createdAt;
    }
    const m = soldItems[i].createdAt.toLocaleString("default", {
      month: "short",
    }) as MType;
    salesObj[m] = salesObj[m] + prices[soldItems[i].productId.toHexString()];
  }
  // console.log(salesObj);

  let salesObjRange!: MonthType;
  for (let i = min.getMonth(); i <= max.getMonth(); i++) {
    let mm = monthEnum[i];
    salesObjRange = {
      ...salesObjRange,
      [mm]: salesObj[mm],
    };
  }
  const sales = Object.keys(salesObjRange).map((date) => ({
    date,
    gross: salesObjRange[date],
  }));

  // console.log(sales);
  const sorted = soldItems.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  let soldRearranged: any = {};
  for (let i = 0; i < sorted.length; i++) {
    const m2 = sorted[i].createdAt.toLocaleString("default", {
      month: "short",
    });
    const val = soldRearranged[m2] ?? [];
    soldRearranged = {
      ...soldRearranged,
      [m2]: [...val, sorted[i].productId.toHexString()],
    };
  }

  Object.keys(soldRearranged).forEach((key) => {
    const products = soldRearranged[key].map((item: string) => {
      return { id: item, count: 1 };
    });
    soldRearranged[key] = products;
  });

  const finalSold: any = {};

  for (const month in soldRearranged) {
    const countsById: any = {};

    (soldRearranged[month] as { id: string; count: number }[]).forEach(
      ({ id, count }) => {
        if (countsById[id]) {
          countsById[id] += count;
        } else {
          countsById[id] = count;
        }
      }
    );

    finalSold[month] = Object.entries(countsById).map(([id, count]) => ({
      id,
      count,
      title: productsNames[id],
    }));
  }
  // console.log(finalSold);

  const productSales = Object.entries(finalSold).map(([date, product]) => ({
    date,
    product,
  }));

  // console.log({...productSales[0]});

  const report = {
    products,
    sales,
    productSales,
    shopsInfo,
  };

  return res.status(200).json({
    success: true,
    message: "Report is generated",
    shopReport: report,
  });
};
