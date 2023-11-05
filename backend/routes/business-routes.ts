import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProducts,
} from "../controllers/business-controller";

const router = express.Router();
const {
  isAuthenticated,
  isBusiness,
} = require("../middlewares/auth-middleware");

router.post("/products", isAuthenticated, isBusiness, getProducts);
router.get("/products-list", getAllProducts);
router.post("/create-product", isAuthenticated, isBusiness, createProduct);
router.post("/delete-product", isAuthenticated, isBusiness, deleteProduct);

module.exports = router;
