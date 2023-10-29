import express from "express";
import { createProduct, getProducts } from "../controllers/business-controller";

const router = express.Router();
const {
  isAuthenticated,
  isBusiness,
} = require("../middlewares/auth-middleware");

router.get("/products", isAuthenticated, isBusiness, getProducts);
router.post("/create-product", isAuthenticated, isBusiness, createProduct);

module.exports = router;
