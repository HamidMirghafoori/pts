import { CookieOptions, NextFunction, Request, Response } from "express";
import {
  BusinessUserModel,
  BusinessUserType,
  UserModel,
  UserType,
} from "../models/user";
import { ErrorResponse } from "../utils/errorResponse";

const expire = process.env.EXPIRE_TOKEN ? +process.env.EXPIRE_TOKEN : 36000000;

exports.signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { isBusiness } = req.body;

  if (!email) {
    return res.status(400).send("Email is missing");
  }

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    return next(new ErrorResponse("E-mail already exists", 400));
  }

  if (isBusiness) {
    const businessDescription: string = req.body.businessDescription || "";
    // const businessType = (req.body.businessType as string) || "";
    // const files = (req.body.files as string[]) || [""];
    if (businessDescription === "") {
      return res.status(400).send("Business description is missing");
    }

    try {
      const businessUser = await BusinessUserModel.create(req.body);
      return res.status(201).json({
        success: true,
        businessUser,
      });
    } catch (error: any) {
      if (error.errors.password) {
        res.status(400).send(error.errors.password.message);
        return;
      }
      if (error.errors.businessDescription) {
        res.status(400).send(error.errors.businessDescription.message);
        return;
      }
      next();
    }
  }

  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    if (error.errors.password) {
      res.status(400).send(error.errors.password.message);
      return;
    }
    next();
  }
};

exports.signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("E-mail and password are required");
    }
    // check user e-mail
    const user = await UserModel.findOne({ email });
    if (!user) {
      const businessUser = await BusinessUserModel.findOne({ email });
      if (!businessUser) {
        return res.status(400).send("user not found");
      }
      // verify user password
      const isMatched = await businessUser.comparePassword(password);
      if (!isMatched) {
        return res.status(400).send("Invalid credentials");
      }
      generateBusinessToken(businessUser, 200, res);
    } else {
      // verify user password
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        return res.status(400).send("Invalid credentials");
      }
      generateUserToken(user, 200, res);
    }
  } catch (error) {
    console.log(error);

    next(new ErrorResponse("Cannot log in, check your credentials", 400));
  }
};

const generateUserToken = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token: string = await user.jwtGenerateToken();

  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expire),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: { ...user._doc, description: "", type: "", application: "NA" },
    });
};

const generateBusinessToken = async (
  user: BusinessUserType,
  statusCode: number,
  res: Response
) => {
  const token: string = await user.jwtGenerateToken();

  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expire),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

//LOG OUT USER
exports.logout = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

export interface ReqType extends Request {
  user: UserType | BusinessUserType | null;
}

export interface ResType extends Response {
  user: UserType | null;
}

// USER PROFILE
exports.userProfile = async (
  req: ReqType,
  res: Response,
  next: NextFunction
) => {
  console.log('USER profile.....');
  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    res.redirect(302, "/api/products-list");
    return;
  }
  // res.sseSetup();
  console.log('user profile found!');
  
  res.status(200).json({
    success: true,
    user,
  });
};
