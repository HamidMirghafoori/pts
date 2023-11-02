import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

const revenueSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: [true, "shopId is missing"],
      ref: "users",
    },
    shopEmail: {
      type: String,
      required: [true, "Shop Email is missing"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, "customerId is missing"],
      ref: "users",
    },
    customerEmail: {
      type: String,
      required: [true, "Customer Email is missing"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, "productId is missing"],
      ref: "products",
    },
    productName: {
      type: String,
      required: [true, "Product name is missing"],
    },
    price: {
      type: Number,
      required: [true, "price is missing"],
    },
    quantity: {
      type: Number,
      default: 1
    },
  },
  { timestamps: true }
);

type IRevenueType = InferSchemaType<typeof revenueSchema>;

export interface RevenueType extends IRevenueType {
  _id: Types.ObjectId;
}

export const RevenueModel: Model<RevenueType> = model<RevenueType>(
  "revenue",
  revenueSchema
);
