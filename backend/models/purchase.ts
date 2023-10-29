import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

const purchaseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "userId is missing"],
      ref: "users",
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, "productId is missing"],
      ref: "products",
    },
    address: {
      type: String,
      required: [true, "Address is missing"],
    },
    rate: {
      type: Number
    },
  },
  { timestamps: true }
);

type IPurchaseType = InferSchemaType<typeof purchaseSchema>;

export interface PurchaseType extends IPurchaseType {
  _id: Types.ObjectId;
}

export const PurchaseModel: Model<PurchaseType> = model<PurchaseType>(
  "purchase",
  purchaseSchema
);
