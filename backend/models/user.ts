import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InferSchemaType, Model, Schema, Types, model } from "mongoose";

const JWT_Secret = process.env.JWT_SECRET || "";

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is missing"],
      maxlength: [32, "Maximum length is 32"],
    },
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
      default: "buyer",
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
userSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, JWT_Secret, {
    expiresIn: 3600,
  });
};

type IUserType = InferSchemaType<typeof userSchema>;

export interface UserType extends IUserType {
  comparePassword(password: string): Promise<boolean>;
  jwtGenerateToken(): string;
  _id: Types.ObjectId;
}

export const UserModel: Model<UserType> = model<UserType>("users", userSchema);
