import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

const JWT_Secret = process.env.JWT_SECRET || "";

// export interface User {
//   email: string;
//   password: string;
//   role: string;
//   _id: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "E-mail is missing"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "E-mail format is not valid",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is missing"],
      minlength: [6, "password must have at least six(6) characters"],
      // match: [
      //   /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
      //   "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters",
      // ],
    },
    role: {
      type: String,
      default: "customer",
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

// encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// verify password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// get the token
userSchema.methods.jwtGenerateToken = function (): string {
  const exp = process.env.EXPIRE_TOKEN
    ? parseInt(process.env.EXPIRE_TOKEN)
    : 3600000;
  return jwt.sign({ id: this.id }, JWT_Secret, {
    expiresIn: Math.floor(Date.now() / 1000) + exp,
  });
};

type IUserType = InferSchemaType<typeof userSchema>;

export interface UserType extends IUserType {
  comparePassword(password: string): Promise<boolean>;
  jwtGenerateToken(): string;
  _id: Types.ObjectId;
}

export const UserModel: Model<UserType> = model<UserType>("users", userSchema);

const businessUserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "E-mail is missing"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "E-mail format is not valid",
    ],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is missing"],
    minlength: [6, "password must have at least six(6) characters"],
    // match: [
    //   /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
    //   "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters",
    // ],
  },
  role: {
    type: String,
    default: "business",
  },
  businessDescription: {
    type: String,
    trim: true,
    required: [true, "Description is missing"],
    maxlength: [128, "Maximum length is 128"],
  },
  isBusiness: {
    type: Boolean,
  },
  businessType: {
    type: String,
    trim: true,
    maxlength: [24, "Maximum length is 24"],
  },
  files: {
    type: [String],
    trim: true,
    maxlength: [256, "Maximum length is 256"],
  },
  status: {
    type: String,
    default: "active",
  },
  application: {
    type: String,
    default: "pending",
  },
});

// encrypting password before saving
businessUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// verify password
businessUserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// get the token
businessUserSchema.methods.jwtGenerateToken = function () {
  const exp = process.env.EXPIRE_TOKEN
  ? parseInt(process.env.EXPIRE_TOKEN)
  : 3600000;
  return jwt.sign({ id: this.id }, JWT_Secret, {
    expiresIn: Math.floor(Date.now() / 1000) + exp,
  });
};

type IBusinessUserType = InferSchemaType<typeof businessUserSchema>;

export interface BusinessUserType extends IBusinessUserType {
  comparePassword(password: string): Promise<boolean>;
  jwtGenerateToken(): string;
  _id: Types.ObjectId;
}

export const BusinessUserModel: Model<BusinessUserType> =
  model<BusinessUserType>("business-users", businessUserSchema);
