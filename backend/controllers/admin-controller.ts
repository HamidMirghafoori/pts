import { NextFunction, Request, Response } from "express";
import { BusinessUserModel } from "../models/user";

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

export const applications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const applicationsRes = await BusinessUserModel.find();
  const applications = applicationsRes.filter(
    (application) => application.application === "pending"
  );

  res.status(200).json({
    success: true,
    applications,
  });
};

export const updateApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, applicationUpdate } = req.body;
    if (!id || !applicationUpdate) {
      return res
        .status(401)
        .send({ message: "ID or applicationUpdate is missing" });
    }

    const objectId = new ObjectId(id);
    const updateRes = await BusinessUserModel.findOneAndUpdate(
      { _id: objectId },
      { application: applicationUpdate }
    );
    console.log(updateRes);

    return res.status(200).json({
      success: true,
      message: "Application updated",
      updateRes,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Application failed to update",
      error,
    });
  }
};
