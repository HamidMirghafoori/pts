import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

const JWT_Secret = process.env.JWT_SECRET || "";

const productsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is missing"],
    },
    bgImg: {
      type: String,
      trim: true,
      required: [true, "Product image is missing"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is missing"],
    },
    destination: {
      type: String,
      trim: true,
      required: [true, "Destination is missing"],
    },
    offers: {
      type: [String],
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: [true, "ownerId is missing"],
      ref: "business-users",
    },
    price: {
      type: Number,
      required: [true, "Price is missing"],
    },
    shopEmail: {
      type: String,
      trim: true,
      required: [true, "E-mail is missing"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "E-mail format is not valid",
      ],
    },
  },
  { timestamps: true }
);

type IProductType = InferSchemaType<typeof productsSchema>;

export interface ProductType extends IProductType {
  _id: Types.ObjectId;
}

export const ProductModel: Model<ProductType> = model<ProductType>(
  "products",
  productsSchema
);
