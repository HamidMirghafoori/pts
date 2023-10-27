import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ReqType } from "../controllers/auth-controller";
import { UserModel } from "../models/user";
import { ErrorResponse } from "../utils/errorResponse";

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
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You must log in to access this resource", 401)
    );
  }
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
