import express from "express";
import { createProduct, getAllProducts, getProducts } from "../controllers/business-controller";

const router = express.Router();
const {
  isAuthenticated,
  isBusiness,
} = require("../middlewares/auth-middleware");

router.post("/products", isAuthenticated, isBusiness, getProducts);
router.get("/products-list", getAllProducts);
router.post("/create-product", isAuthenticated, isBusiness, createProduct);

module.exports = router;
