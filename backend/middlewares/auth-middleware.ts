import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ReqType } from "../controllers/auth-controller";
import { BusinessUserModel, BusinessUserType, UserModel } from "../models/user";

const JWT_Secret = process.env.JWT_SECRET || "";

// check if user is authenticated
exports.isAuthenticated = async (
  req: ReqType,
  res: Response,
  next: NextFunction
) => {
  let token!: string;
  if (req.cookies){
    token = req.cookies.token
  }

  // make sure token exists
  if (!token) {    
      return res.status(200).json({
        message: 'unauthenticated',
        success: true,
        user: null,
      })
  }

  try {
    //verify token
    const decoded = jwt.verify(token, JWT_Secret) as JwtPayload;
    
    req.user = await UserModel.findById(decoded.id);
    if(!req.user){
      req.user = await BusinessUserModel.findById(decoded.id);
      if (!req.user){
        return res.status(401).json({
          message: 'user not found',
        })  
      }
    };
    
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Auth: something went wrong. Login again',
    })    }
};

// admin middleware
exports.isAdmin = (req: ReqType, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      message: 'Access denied, you must be an admin',
    })    
  }
  next();
};

// business middleware
exports.isBusiness = (req: ReqType, res: Response, next: NextFunction) => {
  const user = req.user as BusinessUserType;
  
  if (user.role !== "business") {
    return res.status(401).json({
      message: 'Access denied, you must be a business',
    })    
  }
  if (user.application !== "approved") {
    return res.status(401).json({
      message: 'Access denied, business is not approved',
    })    
  }
  next();
};
